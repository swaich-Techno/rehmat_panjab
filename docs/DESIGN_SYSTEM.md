# REHMAT PANJAB — Design system (V3)

Editorial, tactile, sensory. Warm and fresh. Not a dark gold template. Not SaaS. Water in the morning scenes; oil in commerce, cursor, and evening. One system: denser than conventional luxury. The next interaction peeks at the bottom of the viewport.

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#161815` | Body text, rules |
| `--forest` | `#183A2A` | Primary dark green |
| `--green` | `#476A50` | Mid green (was `--leaf`) |
| `--sage` | `#9EAF9B` | Soft green |
| `--mint` | `#DDE8DD` | Cool ground (was `--mist`) |
| `--cream` | `#F5F1E7` | Page ground |
| `--sand` | `#D7C8AB` | Warm support |
| `--amber` | `#B47A47` | Oil, emphasis |
| `--rose-metal` | `#A66F5F` | Quiet warning / rose |
| `--wine` | `#633736` | Error, evening |

Grain: `public/textures/grain.svg` as a low-opacity multiply overlay. Header is solid cream — no backdrop blur.

Do not introduce purple, electric blue, or neon gold. Do not use `.haze` or `.veil` glow orbs.

## Spacing

Stacked `100dvh` scenes are forbidden except a single cinematic hero that still shares the viewport with headline, bottle, and scroll cue.

| Token | Value | Role |
| --- | --- | --- |
| `--space-section-y` | clamp 40–64 mobile / 64–96 desktop | Default section padding |
| `--space-section-y-tight` | clamp 32–48 / 48–72 | Overlaps and dense passages |
| `--space-scene-min` | `min(92svh, 920px)` | Hero only |
| `--space-scene-min-dense` | `min(72svh, 640px)` | Following scenes |
| `--space-block-gap` | 24–40 | Block stacks |
| `--space-display-gap` | 12–20 | Headline cluster |
| `--space-headline-para` | 12–20 mobile / 16–28 desktop | Headline → paragraph |
| `--space-collection-col` | 24–40 / 32–48 | Collection columns |
| `--space-collection-row` | 40–64 / 64–88 | Collection rows |

Never 160–220px padding unless one cinematic hero. Drop `items-center` on full-viewport scenes. Sections transition (overlap, liquid layer, object carries). `overflow-x: clip` on `html`/`body` stays.

## Water / oil

| Personality | Use | Motion |
| --- | --- | --- |
| Water | Homepage, nav, finder, create-your-Rehmat, morning hero, OTP | Faster fill, mint, wider stretch |
| Oil | Product, ATC, buy, confirm, checkout, Next Drop thank-you | Viscous fill 480ms, amber/wine |

`data-liquid="water|oil"` on LiquidButton. Touch uses a press ripple. Pointer tracking drives fill origin. Magnetism 4–8px on FULL desktop only.

CSS/SVG/canvas first. `OilLayer` canvas is wired on PDP and checkout and pauses offscreen. No WebGL.

## Cursor

Default: V2 `LiquidCursor` — a 20×20 sage/green blob with `mix-blend-mode: multiply` so it stays visible on cream. Native cursor remains until the blob has painted (`data-rehmat-cursor="on"` only after first RAF). Disabled on reduced motion, coarse pointer, keyboard-only, and touch. No oil-droplet-as-only-cursor (invisible on cream). Bottle morph skipped. Mobile uses tap ripples. Never required for function.

## Motion modes

Defined in `lib/motion/mode.ts`. Durations live in `lib/motion/tokens.ts` and are emitted as CSS variables. `scaleDuration` and `motionAllowsCinematic` are wired. No raw duration literals in components.

| Mode | When | Behaviour |
| --- | --- | --- |
| REDUCED | `prefers-reduced-motion` | Instant states, 80ms transitions, no cursor, no RAF loops |
| STANDARD | Default mobile / coarse pointer | Slightly shorter durations, no liquid cursor, tap ripples |
| FULL | Desktop + fine pointer + hover | LiquidCursor blob, refraction, magnetism |

See `docs/MOTION_MAP.md` for every page.

## Type

- Display: Cormorant Garamond (`--font-serif`)
- Interface: Instrument Sans (`--font-sans`)
- Labels: 11px-ish, 0.18em tracking, uppercase, used sparingly
- Headlines: large, broken across lines, often offset
- Mobile: `clamp()`, never `18vw` overflow. Safe-area insets on sticky chrome.

## Layout

12-column desktop grid (`.site-grid`). Asymmetry, overlapping layers, peeking next scenes. Mobile is a different composition — large type stacked.

Homepage: eight-story arc, dense overlapping scenes (`scroll-snap-type: y proximity`). Hero 92svh max with next scene peeking. No heavy scroll-jack.

Footer: large REHMAT wordmark + liquid reflection, not a void of whitespace.

## Motion durations (SSoT)

| Name | Duration |
| --- | --- |
| micro | 180ms |
| fast | 280ms |
| standard | 480ms |
| sheet | 320ms |
| editorial | 750ms |
| cartFly | 780ms |
| buyNow | 720ms |
| cinematic | 1050ms |
| pack | 1100ms |
| vault | 980ms |
| morph | 260ms |
| navExpand | 550ms |
| atc | 750ms |

Easings: liquid `cubic-bezier(0.16, 1, 0.3, 1)`; glass `cubic-bezier(0.22, 0.61, 0.36, 1)`; snap `cubic-bezier(0.32, 0.72, 0.28, 1)`; editorial `cubic-bezier(0.22, 1, 0.36, 1)`. No excessive bounce.

Homepage is dense and cinematic. Commerce is controlled. Checkout is quiet then a short pack. Auth is a vault and short. Confirmation is droplet → ripple → mark → package. Admin is still.

## Mobile

- Touch targets 44px+
- Full-screen liquid nav expanding from the menu control (450–650ms)
- Sticky commerce bar with safe-area on product / cart / checkout
- Cart as a bottom sheet with a curved clip-path
- Fly-to-cart lands on the bar
- Tap ripples instead of a custom cursor

## Components that must not appear

Pill buttons, glass cards, glowing orbs, three-up feature grids, giant gradient wordmarks used as decoration without the footer reveal, icon forests, “where tradition meets innovation” copy, concentric success orbs, trucks in checkout, confetti, invisible custom cursors (`cursor: none` without a painted pointer).

## LiquidButton

Semantic `<button>`, rectangular, 2px radius. Water or oil fill toward the pointer. Compress on press. Expand on success. Magnetism 4–8px on FULL. Keyboard and focus-visible required. Visible label is never replaced by the fill alone. Order flow: ORDER NOW → PREPARING → ORDER READY. ATC: ADDED then ADD ANOTHER after 1.5s.
