# REHMAT PANJAB — Design system

Editorial, tactile, sensory. Warm and fresh. Not a dark gold template. Not SaaS.

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#171814` | Body text, rules |
| `--forest` | `#24442F` | Primary dark green |
| `--leaf` | `#698A62` | Mid green |
| `--sage` | `#A9B9A1` | Soft green |
| `--mist` | `#E9EEE5` | Cool ground |
| `--cream` | `#F5F1E7` | Page ground |
| `--sand` | `#D5C5AA` | Warm support |
| `--amber` | `#B9814D` | Oil, emphasis |
| `--rose-metal` | `#A46F5D` | Quiet warning / rose |
| `--wine` | `#5A302F` | Error, evening |

## Atmospheres

- Morning: sage → ivory → warm sunlight
- Monsoon: deep green → mist grey → pale cream
- Amber: warm ivory → amber glow → soft rose metal
- Garden: fresh leaf → muted sage → soft peach
- Evening: warm charcoal → amber → muted burgundy

Do not introduce purple, electric blue, or neon gold.

## Type

- Display: Cormorant Garamond (`--font-serif`)
- Interface: Instrument Sans (`--font-sans`)
- Labels: 11px-ish, 0.18em tracking, uppercase, used sparingly
- Headlines: large, broken across lines, often offset

## Layout

12-column desktop grid (`.site-grid`). Asymmetry, overlapping layers, uneven negative space. Mobile is a different composition — large type stacked, not a collapsed toolbar of the desktop.

## Motion

| Name | Duration |
| --- | --- |
| fast | 180ms |
| normal | 350ms |
| editorial | 700ms |
| cinematic | 1100ms |

Easing: `cubic-bezier(0.22, 1, 0.36, 1)`. `prefers-reduced-motion` must remain complete, not empty.

Homepage is heavy. Commerce is controlled. Checkout is quiet. Auth is cinematic and short. Confirmation is memorable. Admin is still.

## Components that must not appear

Pill buttons, glass cards, glowing orbs, three-up feature grids, giant gradient wordmarks, icon forests, “where tradition meets innovation” copy.

## LiquidButton

Semantic `<button>`, rectangular, 2px radius. Perfume-oil fill toward the pointer. Compress on press. Expand on success. Keyboard and focus-visible required.
