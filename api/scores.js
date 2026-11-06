// Online leaderboard backed by Vercel Blob.
// Each score is one empty blob whose pathname encodes the entry, so reads are a
// single `list` call (sorted by pathname) and concurrent submits never clobber
// each other. Pathname: scores/<99999999 - score, zero padded>-<name>-<round>-<ts>.json
import { list, put } from '@vercel/blob';

const PREFIX = 'scores/';
const MAX_SCORE = 9_999_999;

const clean = (s) => String(s || '').replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 10) || 'PILOT';

function decode(pathname) {
  const m = pathname.slice(PREFIX.length).match(/^(\d{8})-([A-Za-z0-9_\-]+)-(\d+)-(\d+)\.json$/);
  if (!m) return null;
  return { score: 99_999_999 - Number(m[1]), name: m[2], round: Number(m[3]), ts: Number(m[4]) };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: 'Leaderboard storage is not connected yet.' });
  }
  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: PREFIX, limit: 25 });
      const scores = blobs.map((b) => decode(b.pathname)).filter(Boolean).slice(0, 20);
      return res.status(200).json({ scores });
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const score = Math.floor(Number(body.score));
      const round = Math.max(1, Math.min(999, Math.floor(Number(body.round)) || 1));
      if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
        return res.status(400).json({ error: 'Bad score' });
      }
      const name = clean(body.name);
      const ts = Date.now();
      const path = `${PREFIX}${String(99_999_999 - score).padStart(8, '0')}-${name}-${round}-${ts}.json`;
      await put(path, JSON.stringify({ name, score, round, ts }), {
        access: 'public', addRandomSuffix: false, contentType: 'application/json',
      });
      const { blobs } = await list({ prefix: PREFIX, limit: 25 });
      const scores = blobs.map((b) => decode(b.pathname)).filter(Boolean).slice(0, 20);
      const rank = scores.findIndex((s) => s.ts === ts && s.name === name) + 1;
      return res.status(200).json({ ok: true, rank: rank || null, scores });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: 'Leaderboard error', detail: String(err && err.message || err) });
  }
}
