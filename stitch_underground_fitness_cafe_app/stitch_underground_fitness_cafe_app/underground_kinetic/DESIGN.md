---
name: Underground Kinetic
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c5c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f9378'
  outline-variant: '#444932'
  surface-tint: '#b0d500'
  primary: '#ffffff'
  on-primary: '#2a3400'
  primary-container: '#caf300'
  on-primary-container: '#596c00'
  inverse-primary: '#536600'
  secondary: '#bfd42e'
  on-secondary: '#2d3400'
  secondary-container: '#a3b802'
  on-secondary-container: '#3d4600'
  tertiary: '#ffffff'
  on-tertiary: '#303031'
  tertiary-container: '#e3e2e2'
  on-tertiary-container: '#646464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#caf300'
  primary-fixed-dim: '#b0d500'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3e4c00'
  secondary-fixed: '#d8ee48'
  secondary-fixed-dim: '#bcd12b'
  on-secondary-fixed: '#191e00'
  on-secondary-fixed-variant: '#424b00'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Chivo
    fontSize: 56px
    fontWeight: '900'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Chivo
    fontSize: 38px
    fontWeight: '900'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Chivo
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Chivo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Chivo
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Chivo
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-octane performance, raw industrial discipline, and surgical precision. Built for dual environments—fast-paced cafe counter POS stations and gym-floor mobile self-ordering under dynamic, low-light club conditions—the aesthetic merges brutalist clarity with elite athletic technicality.

The target audience spans dedicated athletes, high-output trainers, and wellness consumers seeking targeted nutrition (pre-workout concoctions, macro-balanced recovery meals, artisan espresso, protein shakes). The interface evokes focus, speed, unwavering authority, and physical power. It eliminates extraneous ornamentation in favor of monolithic charcoal geometry, mechanical line weights, high-contrast monochrome values, and laser-precise pops of acid-lime neon.

## Colors

The color architecture is built on a dark, multi-tiered substrate designed to combat glare and optimize legibility under high-contrast lighting:

- **Base Void (`#0A0A0A`):** The master canvas, creating infinite depth and preserving battery on OLED POS displays and mobile hardware.
- **Surface Layer 01 (`#121212`):** Primary card bodies and grouped modules.
- **Surface Layer 02 (`#1A1A1A`):** Interactive containers, elevated sheets, and secondary surfaces.
- **Surface Layer 03 (`#242424`):** Active states, search bars, inputs, and interactive hovering targets.
- **Structural Outlines (`#2A2A2A`):** Crisp, hard-edge dividers preventing bleed between high-density menu segments.
- **Primary Energy Accent (`#D4FF00` / `#E2F952`):** Hyper-saturated acid lime reserved exclusively for primary action triggers (e.g., checkout, item selection confirmation, real-time macro updates) and active selection states. When text sits on this accent, it must render in `#0A0A0A` for uncompromising contrast.
- **Text Tiers:** Absolute pure white (`#FFFFFF`) for bold structural headers and prices; muted slate grey (`#A3A3A3`) for nutritional subheads, macros, and descriptions.

## Typography

The typographical pairing reinforces the tension between high-velocity athletic power and industrial nutrition calibration:

- **Chivo (Headlines & Core Body):** Selected for its commanding grotesque profile, confident letterforms, and tight tracking. Display sizes leverage black and extra-bold weights (`800`/`900`), driving immediate product recognition at a glance across gym floor distances.
- **Space Mono (Labels, Metadata, POS Tallies, & Macros):** Monospaced precision for protein/carb counts, currency values, order ticket IDs, and timestamp feeds. It brings a functional terminal feel to ordering and preparation queues.
- Text transforms: Major category headers and checkout CTAs are styled uppercase with tightened tracking to emulate athletic compression gear and heavy machinery markings.

## Layout & Spacing

The layout is built for swift touch interactions and zero-misclick ordering during high-intensity intervals:

- **Grid Infrastructure:** A 12-column responsive layout for counter-top POS displays and a flexible 4-column system on mobile devices.
- **Touch Bounds:** All primary interactive entities (modifier pills, item cards, add-to-cart controls) observe an absolute minimum height of 52px (standardized to 56px on POS terminals) to allow swift one-thumb input.
- **Density Zones:** Spacing relies on compact inner padding (`space-sm` to `space-md`) paired with generous outer gutters (`gutter` to `gutter-lg`) to maximize screen efficiency without visual collisions.
- **Reflow Logic:** POS view adopts a persistent split-screen model (60% visual catalogue, 40% active receipt slip). Mobile collapses strictly into a vertical stream with an anchor-pinned bottom status bar displaying macro totals and instant checkout access.

## Elevation & Depth

This design system avoids soft, decorative blurs or faux-physical drop shadows, prioritizing raw planar layering and structural boundaries:

- **Tonal Stepping:** Hierarchy is communicated by stepping from the deep void canvas (`#0A0A0A`) up to elevated structural slabs (`#121212`, `#1A1A1A`, and `#242424`).
- **Laser Contours:** Elevated containers and modal dialogs rely on 1px borders colored `#2A2A2A` to assert structure without adding visual noise.
- **Luminescent Accent Glows:** Key active targets or current preparation tokens use an electric lime shadow with zero spread and high blur (`0px 0px 16px rgba(212, 255, 0, 0.22)`), producing a neon backlit rim light on midnight steel.

## Shapes

The design system uses deliberate, semi-rigid geometry (`roundedness: 1`):

- **Standard Elements (4px / `0.25rem`):** Applied to buttons, item selector cards, input cells, and badge containers. This minute rounding prevents brittle corners while retaining a cold, machined industrial silhouette.
- **Containers & Sheets (8px / `0.5rem`):** Applied to full-page modals, bottom sheets, and major category grouping segments.
- **Status Pills:** Pill geometry (`rounded-full`) is reserved strictly for real-time order states (e.g., "BREWING", "READY FOR PICKUP") and active macro filters, isolating them instantly from structural UI grids.

## Components

### Action Triggers (Buttons)
- **Primary Kinetic Button:** Solid background in `#D4FF00`, bold Chivo text in `#0A0A0A`, 4px corner radius, uppercase styling. On active press, the background tightens to `#E2F952` with an inner border highlight.
- **Secondary Machine Button:** Surface `#1A1A1A`, 1px border in `#2A2A2A`, stark white typography (`#FFFFFF`). Hover/focus converts the border to `#D4FF00`.
- **Ghost/Destructive:** Transparent fill, muted text (`#737373`), activating to blood orange (`#FF3B30`) for order cancellations.

### Catalog & POS Menu Cards
- Built on `#121212` backgrounds with a continuous 1px `#2A2A2A` boundary.
- Top segment features high-contrast food/beverage photography or bold athletic icon codes.
- Lower block highlights the title in Chivo bold white, accompanied by a monospaced nutritional tag (e.g., `38G PRO // 420 KCAL`) in `#D4FF00` or `#A3A3A3`.
- Card bottom displays an integrated full-width "+" target or quantity toggler with immediate visual feedback.

### Macro & Filter Chips
- Unselected: Fill `#1A1A1A`, outline `#2A2A2A`, text `#A3A3A3` in Space Mono.
- Selected: Inverted styling with `#D4FF00` background, `#0A0A0A` text, and bold weighting.

### Inputs & Quantity Steppers
- Height: 52px minimum.
- Base style: Solid `#121212`, 1px outline `#2A2A2A`, white monospace input values. Focus shifts outline directly to `#D4FF00` without soft rings.
- Quantity Steppers: Massive tap areas (`+` / `-`) separated by solid `#2A2A2A` hairline dividers.

### POS Order Ledger & Receipt Ticket
- A docked vertical panel in `#0E0E0E` with a hairline right-border separator.
- Itemized lists feature Space Mono pricing, modifier bullet points in `#737373`, and instant swipe-to-delete gestures.
- The footer block anchors the total amount in 32px Chivo bold, backed by the primary action trigger for rapid payment fulfillment.