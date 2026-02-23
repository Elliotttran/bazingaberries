# Bazinga Berries

A Bejeweled-style match-3 browser game built with Vite + React.

## Run

```bash
npm install
npm run dev
```

## Sound Files

Place MP3 files in `public/sounds/`:

| File            | Trigger                          |
|-----------------|----------------------------------|
| `select.mp3`   | Tile selected                    |
| `swap.mp3`     | Successful swap                  |
| `invalid.mp3`  | Failed swap attempt              |
| `pop.mp3`      | Tiles cleared (once per wave)    |
| `bazinga.mp3`  | Big moment (4+ match or cascade) |
| `gameover.mp3` | Game over                        |

Placeholder silent files are included. Replace with real sounds anytime.

## Theme System

All visual values live in `src/theme/tokens.js`. Asset paths live in `src/theme/assets.js`.
Components read from these files — no hardcoded colors, sizes, or paths in components.

To reskin the game (Phase 2): replace `tokens.js` and `assets.js`. Components stay untouched.

## Phase Roadmap

- **Phase 1** (current): Gameplay mechanics + placeholder visuals + sound system
- **Phase 2**: Visual reskin with berry sprites and polished assets
- **Phase 3**: Time attack mode, expanded sounds, possible specials
