# Bazinga Berries — Visual Overhaul Plan

## Context

The game is functionally complete with solid match-3 mechanics. The next goal is a visual overhaul to match the tropical concept art: bamboo frame, wooden score sign, tropical background, sparkly grid interior, and decorative elements. The approach is hybrid (real assets + CSS), lightweight-first, and must be responsive across mobile and tablet/desktop.

## Aesthetic Direction

The concept image is AI-generated inspiration, not a final spec. The goal is to capture these core pillars:

1. **Warm tropical energy** — shift away from cold purple/navy toward warm ambers, teals, and sunset oranges
2. **Organic textures** — bamboo frame + wood-grain score sign give a handcrafted market-stall feel vs. the current techy look
3. **Lush, alive** — decorative fruit/leaves around the frame edges, sparkly interior for the board
4. **Graceful simplification on mobile** — decorations hide/reduce at small breakpoints; the core frame + background always show

Production realities vs. concept: the AI image is portrait with a tall grid. Our board is square-ish and needs to work in a browser. The bamboo frame will be adapted to fit our actual layout, not replicated pixel-for-pixel.

---

## Current Architecture (key files)

- `src/App.css` — body background gradient
- `src/components/GameShell.jsx` + `GameShell.css` — top-level layout
- `src/components/AppHeader.jsx` — logo + combo meter + mute button
- `src/components/Board.jsx` + `Board.css` — 8×8 grid
- `src/components/HUD.jsx` + `HUD.css` — score + moves display
- `src/components/Tile.jsx` + `Tile.css` — individual fruit tiles
- `src/theme/tokens.js` — design tokens (colors, sizes)

---

## Recommended Approach: Phased Rollout

Each phase is independently shippable. Start with Phase 1 for the highest visual impact with minimal risk.

---

### Phase 1: Background + Board Interior Skin
**Files:** `src/App.css`, `src/components/Board.css`, `src/theme/tokens.js`

- Replace the body gradient with a tropical-inspired CSS background (deep teal-to-sky gradient with warm orange sunset glow). Optionally swap for a lightweight optimized JPG (≤100KB) if CSS alone doesn't look good enough.
- Add a `background: radial-gradient` sparkle layer inside the board using a CSS `::before` pseudo-element — dark navy-to-black with subtle star dots via small box-shadows or CSS noise.
- Update `tokens.js` board background to match.
- **Mobile**: Full-bleed background on all sizes. Board interior sparkle scales with the board.

**Outcome:** Transforms the overall atmosphere with zero structural changes.

---

### Phase 2: Bamboo Frame
**Files:** `src/components/GameShell.jsx`, `src/components/GameShell.css`, possibly `img/` for frame asset

- Wrap the `<Board>` in a new `<div className="frame-wrapper">` inside `GameShell`.
- **Asset approach**: Use a bamboo frame PNG with transparency (sourced or generated). Use CSS `border-image` 9-slice technique.
  - If a suitable asset can't be found quickly, fall back to a CSS-only bamboo look.
- The frame should size itself to match the board dimensions (`min(90vw, 70vh, 640px)`).
- **Mobile**: Frame scales with board. Decorative overhangs reduce or simplify at small breakpoints.

**Outcome:** The signature visual element that makes it feel like the concept.

---

### Phase 3: Score Display — Wooden Sign
**Files:** `src/components/HUD.jsx`, `src/components/HUD.css`, `src/components/RolodexScore.jsx`

- New `<WoodenSign>` component sits above the frame wrapper, centered.
- Sign is a PNG with: arched top, side rail extensions, dark recessed oval for the number.
- `RolodexScore` overlaid via `position: absolute`, centered on the oval.
- Sign flourishes (cocktail glass left, berry cluster right) are separate PNGs, `position: absolute`, `overflow: visible` — never stretch.
- **Mobile**: Sign width matches frame, font scales with `clamp()`.

**Outcome:** Score display becomes part of the frame presentation.

---

### Phase 4: Decorative Elements
**Files:** `src/components/GameShell.jsx`, `src/components/GameShell.css`, `img/` assets

Decorations positioned `absolute` relative to `frame-wrapper`:
- **Top-left**: Cocktail glass with straw (PNG, ~80×100px rendered)
- **Top-right**: Tropical bird (PNG, ~80×80px rendered)
- **Corners**: Fruit/leaf clusters (reuse existing fruit PNGs + CSS leaf shapes)

All purely presentational (`aria-hidden="true"`).
- **Mobile (< 480px)**: Hide decorative elements entirely.
- **Tablet/Desktop**: Show at full size.

**Outcome:** Completes the "lush tropical" feel.

---

### Phase 5: Responsive Polish Pass
**Files:** All component CSS files

- Audit all breakpoints: 320px, 375px, 480px, 768px, 1024px+
- Ensure frame, sign, and board all scale harmoniously
- Verify touch targets remain accessible on mobile

---

## Asset Strategy

| Element | Approach | Source |
|---|---|---|
| Tropical background | CSS gradient (or lightweight JPG fallback) | DIY |
| Board sparkle | CSS `::before` + box-shadow stars | DIY |
| Bamboo frame | PNG with transparency — AI generated, 9-sliced via CSS border-image | Generate |
| Wooden sign body | PNG with arch shape + dark oval recess | Generate |
| Sign flourishes (glass, berries) | Separate PNGs, position:absolute, never stretch | Generate / Existing |
| Cocktail glass | PNG with transparency — AI generated | Generate |
| Tropical bird | PNG with transparency — AI generated | Generate |
| Leaf/fruit corners | Reuse existing fruit PNGs + CSS | Existing |

### How to Generate Assets

Use ChatGPT (DALL-E) or Midjourney.

**Bamboo Frame PNG** (9-sliceable):
> "Bamboo picture frame, straight-on flat view, uniform bamboo poles along all four edges, square corners with bamboo joint knots, hollow transparent center, game UI art style, PNG with alpha channel"
- Export at 1024×1024px minimum
- Corners must be square, rails must be uniform/straight (not artistic) for 9-slice to work cleanly

**Wooden Sign PNG**:
> "Wooden sign panel for a fruit match-3 game, arched curved top, side rail extensions, dark recessed oval cutout in center for score display, warm wood grain texture, tropical game UI style, transparent background outside the sign shape, PNG"

**Cocktail glass + Bird** (separate PNGs):
> "[tropical cocktail glass / tropical parrot], game UI decoration, isolated on transparent background, colorful cartoon style, PNG"
- Export at ~256×256px

**If AI generation fails:** Claude can generate SVG bamboo directly — no external tools needed.

---

## Layer Stack (Z-Space Architecture)

Everything in the UI is a layer — no document flow for visual elements. Depth ordering from back to front:

```
z-index 0   Tropical background              Furthest back, full bleed
z-index 1   Board sparkle interior           Dark starry layer inside board
z-index 2   Bamboo frame PNG                 Sits over board edges (9-slice)
z-index 3   Sign body PNG                    Wooden arch shape, centered top
z-index 4   Sign flourishes                  Cocktail glass (left), berry cluster (right)
z-index 5   Bird / corner leaf clusters      In front of bamboo frame
z-index 6   RolodexScore                     Overlaid on sign oval, always readable
z-index 7   Floating score popups            Above all game art
z-index 8   Hype overlay                     Fullscreen, topmost
```

### Key Rules
- All decorative PNGs use `pointer-events: none` — never block clicks
- All flourishes use `position: absolute` anchored to parent with `overflow: visible`
- Flourishes are fixed size — never stretch. Only rails and sign body stretch
- Sign container, frame wrapper, board — all `position: relative`

### Asset Modularity Rules
| Element | Stretches? | Why |
|---|---|---|
| Bamboo frame rails | Yes (CSS border-image 9-slice) | Must fit any board width |
| Bamboo frame corners | No | Would distort if scaled |
| Sign body PNG | Width stretches (background-size: cover) | Must match frame width |
| Sign flourishes (glass, berries) | No | Fixed decorations, anchor to edges |
| Bird / corner leaves | No | Fixed decorations, anchor to frame corners |
| Background | Yes (full bleed) | Fills viewport |

---

## Juice / Pop Animations (Phase 6)
Pure code — no assets needed.

- **Squash & stretch**: tile scale-up punch to 1.4× before disappearing (already partially done, needs amplifying)
- **Glow burst**: expanding radial ring in the fruit's glow color at peak of pop
- **Particle burst**: 8 color-matched dots shooting outward, bigger spread than current
- **Cascade crescendo**: feed cascade depth into animation intensity (bigger bursts on wave 2, 3, etc.)
- **Neighbor ripple**: adjacent tiles get a 0.95 → 1.0 scale nudge when a match pops near them

All implemented via CSS keyframes + existing `glowColor` token per fruit type.

---

## Model Strategy (two-tab setup)

- **Sonnet tab** — implement Phases 1, 3, 4, 5, 6 (CSS work, component styling, decorative layout, juice)
- **Opus tab** — use for Phase 2 (bamboo frame architecture — layout restructure, `position` strategy, responsive frame sizing decisions)

---

## Verification

After each phase:
1. `npm run dev` → view in browser
2. Check mobile (375px), tablet (768px), desktop (1280px) using browser DevTools
3. Play through a full game to confirm no UI regressions (score, moves, combo still work)
4. Check touch interactions on mobile breakpoint
