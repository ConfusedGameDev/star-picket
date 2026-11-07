# Star Picket

A Bosconian-style free-roaming space shooter for the browser. Live at https://star-picket.vercel.app

- Press anywhere and drag to steer (floating virtual stick). Guns fire fore and aft automatically.
- Clear every hex station in the sector: destroy all six cannon pods, or shoot the core.
- Alert conditions: Green → Yellow (a base has noticed you) → Red (you lingered too long, or a spy ship got away). Red brings fighters from every direction until the sector is cleared.
- Spy ship: shoot it before it leaves (200 → 400 → 800).
- Squadrons: five ships in a V, launched from a base ("Battle stations!"). Kill the leader and the wingmen break off and flee; kill all five for a bonus.
- Score popups fly into a rolling score counter.
- Keyboard: arrows / WASD to steer, P to pause, V to switch art style.

## Settings

- **Art style**: Vector (the original neon lines) or Pixel, which uses the
  [Lunar Battle Pack](https://mattwalkden.itch.io/lunar-battle-pack) by Matt Walkden (CC0, sheets in `assets/lunar/`).
  The pixel playfield is drawn at one canvas pixel per CSS pixel and scaled up unsmoothed; ships snap to 32 facings.
- **Music**: a 124 BPM loop over Am · F · C · G whose drums and bass build with the alert condition. Every kill is a
  note: it waits for the next 16th, takes its pitch from the chord playing then, and a run of kills climbs the chord.
  Kills that land together (mine chains, squadrons) spill into the next 16ths as an arpeggio; stations play a full
  chord with a sub drop. Off gives the classic arcade effects.
- **Sound**: master mute.

## Online leaderboard

`api/scores.js` is a Vercel function backed by Vercel Blob. Each score is one blob whose pathname encodes the entry,
so the top list is a single sorted `list` call and concurrent posts never overwrite each other.

Setup: in the Vercel dashboard, Storage → Create → Blob (public), connect it to this project. That injects
`BLOB_READ_WRITE_TOKEN`; redeploy and the leaderboard goes live. Until then the game shows "Leaderboard offline".

## Share

"Share score" renders a 1080×1080 patrol report on a canvas and uses the Web Share API (with the image where supported),
falling back to a download plus a copy-to-clipboard link.
