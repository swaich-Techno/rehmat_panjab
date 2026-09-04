# Motion map — Rehmat Panjab V3.3

Durations from `lib/motion/tokens.ts`. Modes: FULL (desktop fine pointer), STANDARD (mobile/coarse), REDUCED (`prefers-reduced-motion`). Offscreen work pauses via `useOffscreenPause`; CSS loops pause when the tab is hidden. Custom cursor never required for function.

Page transitions play on FULL and STANDARD (scaled). Mapped rooms keep their kind; other room changes wipe so the veil is visible. Nav and LiquidLink play the veil *before* navigation.

Click is the valuable motion. Ambient loops are atmosphere only — never the name, never a second design system.

## Tokens

| Band | ms | Use |
| --- | --- | --- |
| micro | 180 | cursor press-in, magnet reset |
| fast | 280 | water fill, nav underline, ink ripple |
| pressSettle | 340 | click overshoot settle (280–400) |
| standard | 480 | sheets, option wash, size goo, card wash |
| editorial | 750 | reveals, split text |
| cinematic | 1050 | hero refraction one-shot, light sweep |
| morph | 260 | cursor path |
| navExpand | 550 | mobile menu |
| atc | 750 | add-to-cart fill |
| addAnother | 1500 | ATC label reset |
| buyNow | 720 | oil pour + VT |
| vault | 980 | archive door |
| droplet / ripple | 640 / 820 | drop ceremonies |
| oil fill | 480 (standard) | LiquidButton viscous fill |

Easings: `liquidEase`, `glassEase`, `snapEase`, `editorialEase`, `overshoot`, `press`. No extra bounce. Press scale token: `0.96`.

## Global

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| LiquidCursor sage blob | pointermove FULL | lerp 0.18 | 20×20 green/forest circle, mix-blend multiply. Native cursor until first paint. No bottle morph. | Disabled; tap ripple | Off |
| TapRipple | touch pointerdown | ripple 820 | Feedback without custom cursor | Yes | Off |
| RouteTransition | pathname change | editorial / vault / pour | HOME→PDP glass; PDP→quiz water; quiz result merge; login→account vault; cart→checkout oil; checkout→success droplet | STANDARD skips cinematic veils | Instant navigate |
| Atmosphere light | CSS 28s, paused offscreen | light-through | Light through liquid *behind* type | Same, cheaper | Static |
| Scroll stretch + oil thicken | scroll | micro settle | `--oil-thick` on hero atmosphere only | Damped | Off |
| Grain overlay | always | — | Paper tooth | Same | Same |
| Click press system | pointerdown / Enter / Space | micro in, pressSettle out | Scale 0.96, fill from origin, overshoot settle | Same | Instant |

## Home `/`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Hero wordmark lock | always | — | REHMAT PANJAB is planted. No bob, tilt, pointer follow, or live refraction on the letters. | Same | Same |
| SplitTextReveal | mount | editorial + 48ms/word | One-shot enter, then lock | Same | Immediate text |
| Hero refraction | mount | cinematic one-shot | Water film on the *atmosphere sheet only*, then settles | Lower intensity | Static |
| Bottle lerp | pointer on bottle | RAF 0.12 | Max 8px. Wordmark does not follow. No idle breathe. | Touch skips | Static |
| Signature drop + scene connectors | IO at hinges | droplet then ripple | Connects scenes without adding height | Same | Off |
| Notes atmosphere | IO enter | cinematic one-shot | MUSK / OUD / ROSE settle in. No endless drift. | Same | Static words |
| LiquidMask glass/sweep/oil | IO | editorial / cinematic | Varied image reveals | sweep→liquid on STANDARD | Shown |
| Collection card wash | click | standard 480 | Clip-path oil wash from pointer, then navigate | Same | Instant |
| Finder / create / next CTAs | click | press + fill | Click value, not hover decoration | Press ripple | Instant fill |

## Shop `/collection` and PDP `/product/[slug]`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Sequential compositions | IO masks | editorial | Overlapping labels, not a card grid | Same | Shown |
| Card click wash | click origin | standard 480 | Circle wash then route | Same | Instant |
| OilLayer canvas | PDP/checkout | RAF paused offscreen | Oil personality | STANDARD slower | Static wash |
| Size pills goo | size change | standard 480 | Amber oil blob, SVG blur + colormatrix. Not neon slime. | Same | Snap |
| ATC fill, punch, fly, ripple, ADDED → ADD ANOTHER | click | pressSettle + 750 then 1500 | Physical even while launching soon / unpriced | Fly lands on bar | Instant add |
| Buy now / Request oil pour + VT | click | 720 | Cart then checkout. Same press as priced. | Pour CSS | Instant |

## Cart `/cart` and drawer

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Curved clip-path sheet | open | sheet 320 | Not a generic panel | Bottom sheet polygon | Instant |
| Empty bottle + drop | empty | droplet | YOUR SHELF IS WAITING | Same | Still |
| Line dissolve | remove | editorial | Oil leaving | Same | Instant remove |

## Quiz `/find-your-scent` and Create `/create-your-fragrance`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Word expand | click that option | pressSettle + standard | Selected word scales ~1.14, burst to 1.22 | Same | Class only |
| Atmosphere wash | same click origin | standard 480 | Clip-path wash from the word + local row wash | Same | Class only |
| Liquid selection | click or hold | fast | Visible “Click or hold”; hold is extra | Same | Outline |
| Result merge veil | last continue | editorial | Quiz → result | Same | Skip |
| VirtualBottle fill + neck drop | answers | editorial + droplet | Notes fall into the vessel; blend colour | Same | Height snap |
| Orbiting notes | result | 16–18s | YOUR REHMAT | Same | Labels static |

## Next drop `/next-drop`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Virtual bottle | votes | editorial | Vote reshapes the next oil | Same | Snap |
| Thank-you line | success | — | YOU JUST HELPED SHAPE THE NEXT REHMAT | Same | Same |
| Droplet → bell | notify save | fast | Opt-in only; email/SMS start unchecked | Same | Bell shown |
| Reward glass | code issued | normal | Honest 5% once | Same | Immediate |

## Auth `/auth/*` and account

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Vault door | real success only | vault 980 | PRIVATE FRAGRANCE ARCHIVE | Same | Open state |
| Cursor keyhole→vault | login hover FULL | morph | Does not block click | Off | Off |
| OTP drop hits lock | real verify | droplet then vault | No fake SMS | Same | Copy only |

## Checkout `/checkout` and `/order/[id]`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Pack ceremony | submit | pack 1100 | Quiet bottle→carton→parcel | Same | Skip |
| Confirmation drop→ripple→emblem→package | server ok only | droplet, ripple, editorial | No confetti | Same | States only |

## Nav / chrome

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Liquid underline + magnetic hover | hover / route | fast | Underline travels with pointer; blob follows | Hidden desktop nav | Instant |
| Nav click compress + ink | pointer / keyboard | micro + fast | Scale 0.96 + oil/ink ripple at pointer | Same | Instant |
| LiquidButton magnet + press + bloom | hover / press / success | micro / pressSettle / 480 | Viscous fill from click (or centre on keyboard), press 0.96, overshoot settle | Press ripple | Off |
| Mobile liquid expand | menu | 550, items stagger 70ms | Expands from menu control, contracts closed | Yes | Instant panel |
| Footer wordmark + oil rise | IO | editorial | REHMAT clips up with a rising oil wash | Same | Shown |

## Admin

No heavy motion. Wizard and CMS stay still aside from 80ms reduced transitions.

## Animation roadmap — next upgrades

Ranked by impact. Do the ones that answer a click or a scroll story now; wait on anything that needs real photography.

1. **Hero scroll story (do now)** — The bottle and oil thicken already peek. Next: a two-beat scroll where morning light cools into the first glass without moving the wordmark. CSS clip + `--oil-thick` only.
2. **PDP unboxing vault (do now)** — First PDP visit opens a short glass door (existing vault tokens) onto the bottle. One-shot, never on every add-to-cart.
3. **Checkout pack as a held object (do now)** — Pack ceremony already exists; make the bottle→carton→parcel a single sticky object the request button “hands over,” not a overlay flash.
4. **OTP glass edge (do now)** — Real verify only: the code field’s edge fills with a water meniscus, then the vault opens. No fake SMS animation.
5. **Cart fly landing (do now)** — Fly exists; next is a visible catch on the cart numeral (count ticks with a drop) so the destination is as physical as the departure.
6. **Quiz last-question merge (do now)** — The merge veil is late. Start blending the chosen words into the match name *during* the last Continue press.
7. **Collection overlap carry (do now)** — The clicked card’s wash should become the PDP hero wash (shared origin) so the room change feels like one pour.
8. **3D / photographed bottle (wait)** — No WebGL until commissioned bottle photos exist. Placeholder SVG cannot carry a turntable. When photos land, a 6–8° CSS rotate with the existing 8px lerp is enough; skip Three.js.
9. **Unboxing film on first purchase (wait)** — A true unboxing needs the carton, tissue, and bottle in stills or a 4–6s loop. Until then keep the pack ceremony abstract.
10. **Note-field as a hover instrument (later)** — MUSK / OUD / ROSE could part around the cursor on hover (not idle). Only after the lock on the homepage name has been lived with.
11. **Size-pill pour into the bottle (later)** — Selecting 12 ml / 24 ml should raise the virtual fill in the PDP bottle. Needs a bottle photograph with a clear juice level, or it reads as a toy.
12. **Account vault shelves (later)** — Saved oils as bottles on a glass shelf that rack on login. Wait for product photography; the vault door is enough until then.
