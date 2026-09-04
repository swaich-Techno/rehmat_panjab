# REHMAT PANJAB — Design system (V2)

Editorial, tactile, sensory. Warm and fresh. Not a dark gold template. Not SaaS. Water in the morning scenes; oil in commerce and evening.

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

## Water / oil

| Personality | Use | Motion |
| --- | --- | --- |
| Water | Finder, create-your-Rehmat, morning hero, OTP ring | Faster fill, brighter mint, wider stretch/overshoot |
| Oil | Commerce, checkout, evening, Next Drop thank-you | Slower fill, amber/wine, viscous compress |

`data-liquid="water|oil"` on LiquidButton. Touch uses a press ripple from the tap. Pointer tracking drives fill origin.

## Motion modes

Defined in `lib/motion/mode.ts`. Durations live in `lib/motion/tokens.ts` and are emitted as CSS variables. No raw duration literals in components.

| Mode | When | Behaviour |
| --- | --- | --- |
| REDUCED | `prefers-reduced-motion` | Instant states, 80ms transitions, no cursor, no RAF loops |
| STANDARD | Default mobile / coarse pointer | Slightly shorter durations, no liquid cursor |
| FULL | Desktop + fine pointer + hover | Cinematic path morph, cursor, refraction |

Pause offscreen (IntersectionObserver) and when the document is hidden.

## Type

- Display: Cormorant Garamond (`--font-serif`)
- Interface: Instrument Sans (`--font-sans`)
- Labels: 11px-ish, 0.18em tracking, uppercase, used sparingly
- Headlines: large, broken across lines, often offset
- Mobile: `clamp()`, never `18vw` overflow. `overflow-x: clip` on `html`/`body`. Safe-area insets on sticky chrome.

## Layout

12-column desktop grid (`.site-grid`). Asymmetry, overlapping layers, uneven negative space. Mobile is a different composition — large type stacked, not a collapsed toolbar of the desktop.

Homepage: eight snap-ish `100dvh` scenes (`scroll-snap-type: y proximity`). No heavy scroll-jack.

## Motion durations (SSoT)

| Name | Duration |
| --- | --- |
| fast | 180ms |
| normal | 350ms |
| sheet | 320ms |
| editorial | 700ms |
| cartFly | 780ms |
| buyNow | 720ms |
| cinematic | 1100ms |
| pack | 1200ms |
| vault | 900ms |

Easing: `cubic-bezier(0.22, 1, 0.36, 1)` weighted; liquid `cubic-bezier(0.16, 1, 0.3, 1)`; overshoot for nav blob.

Homepage is heavy. Commerce is controlled. Checkout is quiet then a short pack. Auth is cinematic and short. Confirmation is a droplet → asymmetric ripple → mark. Admin is still.

## Mobile

- Touch targets 44px+
- Full-screen liquid nav
- Sticky commerce bar with safe-area on product / cart / checkout
- Cart as a bottom sheet (280–350ms)
- Fly-to-cart lands on the bar

## Components that must not appear

Pill buttons, glass cards, glowing orbs, three-up feature grids, giant gradient wordmarks, icon forests, “where tradition meets innovation” copy, concentric success orbs, trucks in checkout.

## LiquidButton

Semantic `<button>`, rectangular, 2px radius. Water or oil fill toward the pointer. Compress on press. Expand on success. Keyboard and focus-visible required. Visible label is never replaced by the fill alone. Order flow: ORDER NOW → PREPARING → ORDER READY.
