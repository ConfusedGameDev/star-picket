# Star Picket

A Bosconian-style free-roaming space shooter for the browser. Live at https://star-picket.vercel.app

- Press anywhere and drag to steer (floating virtual stick). Guns fire fore and aft automatically.
- Clear every hex station in the sector: destroy all six cannon pods, or shoot the core.
- Alert conditions: Green → Yellow (a base has noticed you) → Red (you lingered too long, or a spy ship got away). Red brings fighters from every direction until the sector is cleared.
- Spy ship: shoot it before it leaves (200 → 400 → 800).
- Squadrons: five ships in a V, launched from a base ("Battle stations!"). Kill the leader and the wingmen break off and flee; kill all five for a bonus.
- Score popups fly into a rolling score counter.
- Keyboard: arrows / WASD to steer, P to pause.

## Online leaderboard

`api/scores.js` is a Vercel function backed by Vercel Blob. Each score is one blob whose pathname encodes the entry,
so the top list is a single sorted `list` call and concurrent posts never overwrite each other.

Setup: in the Vercel dashboard, Storage → Create → Blob (public), connect it to this project. That injects
`BLOB_READ_WRITE_TOKEN`; redeploy and the leaderboard goes live. Until then the game shows "Leaderboard offline".

## Share

"Share score" renders a 1080×1080 patrol report on a canvas and uses the Web Share API (with the image where supported),
falling back to a download plus a copy-to-clipboard link.
