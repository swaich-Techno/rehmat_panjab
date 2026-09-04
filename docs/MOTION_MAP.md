# Motion map — Rehmat Panjab V3

Durations from `lib/motion/tokens.ts`. Modes: FULL (desktop fine pointer), STANDARD (mobile/coarse), REDUCED (`prefers-reduced-motion`). Offscreen work pauses via `useOffscreenPause`. Custom cursor never required for function.

## Tokens

| Band | ms | Use |
| --- | --- | --- |
| micro | 180 | cursor press, magnet reset |
| fast | 280 | water fill, nav underline |
| standard | 480 | sheets, option rings |
| editorial | 750 | reveals, split text |
| cinematic | 1050 | hero refraction, light sweep |
| morph | 260 | cursor path |
| navExpand | 550 | mobile menu |
| atc | 750 | add-to-cart fill |
| addAnother | 1500 | ATC label reset |
| buyNow | 720 | oil pour + VT |
| vault | 980 | archive door |
| droplet / ripple | 640 / 820 | drop ceremonies |
| oil fill | 480 (standard) | LiquidButton viscous fill — 300–600, not seconds |

Easings: `liquidEase`, `glassEase`, `snapEase`, `editorialEase`. No extra bounce.

## Global

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| LiquidCursor sage blob | pointermove FULL | lerp 0.18 | 20×20 green/forest circle, mix-blend multiply. Native cursor until first paint. No bottle morph. | Disabled; tap ripple | Off |
| TapRipple | touch pointerdown | ripple 820 | Feedback without custom cursor | Yes | Off |
| RouteTransition | pathname change | editorial / vault / pour | HOME→PDP glass; PDP→quiz water; quiz result merge; login→account vault; cart→checkout oil; checkout→success droplet | STANDARD skips cinematic veils | Instant navigate |
| Atmosphere light | CSS 28s, paused offscreen | light-through | Light through liquid | Same, cheaper | Static |
| Scroll stretch + oil thicken | scroll | micro settle | scaleY + --oil-thick on hero | Damped | Off |
| Grain overlay | always | — | Paper tooth | Same | Same |

## Home `/`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Hero refraction | mount, IO pause | 6–11s noise | Stronger water film over REHMAT PANJAB | Lower intensity | Static |
| SplitTextReveal | mount | editorial + 48ms/word | Words enter, blur resolve, horizontal mask | Same | Immediate text |
| Bottle breathe + light | idle + pointer | 5.6s + micro | Shared viewport with headline + cue | Touch skips idle pointer | Static |
| Signature drop + scene connectors | IO at hinges | droplet then ripple | Connects scenes without adding height | Same | Off |
| Notes atmosphere | CSS drift 16–22s | slow | MUSK / OUD / ROSE float, staggered | Same | Static words |
| LiquidMask glass/sweep/oil | IO | editorial / cinematic | Varied image reveals | sweep→liquid on STANDARD | Shown |
| Finder / create / next CTAs | hover fill | water/oil fill | Continue the arc | Press ripple | Instant fill |

## Shop `/collection` and PDP `/product/[slug]`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Sequential compositions | IO masks | editorial | Overlapping labels, not a card grid | Same | Shown |
| OilLayer canvas | PDP/checkout | RAF paused offscreen | Oil personality | STANDARD slower | Static wash |
| ATC fill, bottle rise, fly, ripple, ADDED → ADD ANOTHER | click | 750 then 1500 | Never blocks | Fly lands on bar | Instant add |
| Buy now oil pour + VT | click | 720 | Cart then checkout | Pour CSS | Instant |

## Cart `/cart` and drawer

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Curved clip-path sheet | open | sheet 320 | Not a generic panel | Bottom sheet polygon | Instant |
| Empty bottle + drop | empty | droplet | YOUR SHELF IS WAITING | Same | Still |
| Line dissolve | remove | editorial | Oil leaving | Same | Instant remove |

## Quiz `/find-your-scent`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| Atmosphere shift | selected option | standard 480 | Wash layer actually interpolates FRESH/DARK/ROMANTIC | Same | Class only |
| Liquid selection ring | held option | fast | Not boxes | Same | Outline |
| Result merge veil | last continue | editorial | Quiz → result | Same | Skip |

## Create `/create-your-fragrance`

| Animation | Trigger | Duration | Purpose | Mobile | Reduced |
| --- | --- | --- | --- | --- | --- |
| VirtualBottle fill + neck drop | answers | editorial + droplet | Notes fall into the vessel; blend colour | Same | Height snap |
| Orbiting notes | result | 16–18s | YOUR REHMAT | Same | Labels static |
| Share 9:16 / 1:1 | click | — | Branded cards, no PII | Download | Download |

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
| Liquid underline + magnetic hover | hover / route | fast | Underline + drop track the pointer; blob follows | Hidden desktop nav | Instant |
| LiquidButton magnet + squash + bloom | hover / press / success | micro / 480 | Viscous fill 280–480ms, press squash, success bloom | Press ripple | Off |
| Mobile liquid expand | menu | 550, items stagger 70ms | Expands from menu control, contracts closed | Yes | Instant panel |
| Footer wordmark + oil rise | IO | editorial | REHMAT clips up with a rising oil wash | Same | Shown |

## Admin

No heavy motion. Wizard and CMS stay still aside from 80ms reduced transitions.
