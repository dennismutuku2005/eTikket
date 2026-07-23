# eTikket Design System

**Product:** eTikket — Event ticketing web app for Kenya
**Flow:** Organizer creates event → shares link → attendee opens link (or logs in) → pays via M-Pesa STK Push → gets QR ticket → organizer scans QR at venue for check-in.

---

## 1. Brand & Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#f33959` | Primary buttons, active states, price tags, highlights, link accents |
| `--color-primary-hover` | `#d92847` | Button hover/pressed state |
| `--color-primary-tint-10` | `#fde8ec` | Selected chip backgrounds, subtle highlight fills |
| `--color-primary-tint-20` | `#fbd0d8` | Badge backgrounds, progress bars |
| `--color-bg` | `#fafafa` | App background |
| `--color-surface` | `#ffffff` | Cards, modals, sheets, nav bar |
| `--color-surface-alt` | `#f4f4f5` | Input fields, secondary buttons, skeleton base |
| `--color-border` | `#ececec` | Card borders, dividers |
| `--color-text-primary` | `#0f0f10` | Headings, primary text |
| `--color-text-secondary` | `#6b6b70` | Descriptions, meta text, timestamps |
| `--color-text-muted` | `#a3a3a8` | Placeholder text, disabled labels |
| `--color-success` | `#16a34a` | Payment success, "Going" state |
| `--color-warning` | `#f59e0b` | Pending payment, low ticket stock |
| `--color-error` | `#dc2626` | Failed payment, form errors |
| `--color-overlay` | `rgba(15,15,16,0.55)` | Modal / bottom-sheet backdrop |
| `--color-dark-surface` | `#111113` | Bottom nav bar, dark chips (attendee avatars stack) |

**Color rules**
- `#f33959` is used sparingly and intentionally — one primary CTA per screen, plus small accents (bookmark active, price, selected tab).
- Never place primary-on-primary. Text on `#f33959` is always `#ffffff`.
- Background is never pure white (`#ffffff` reserved for elevated surfaces like cards/modals sitting on the `#fafafa` canvas) — this is what gives cards their lift without needing heavy shadows.

---

## 2. Typography

Font family: **Inter** (or a geometric grotesk like Manrope) for UI text — clean, neutral, works well for numbers (prices, dates, ticket counts).

| Style | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| Display | 28px | 700 (Bold) | 34px | Event title on Event Details |
| H1 | 22px | 700 | 28px | Screen titles ("Event Details", "Discover") |
| H2 | 18px | 600 (SemiBold) | 24px | Section headers ("Popular Event", "Ongoing Splits") |
| Body Large | 16px | 500 (Medium) | 22px | Card titles, host name |
| Body | 14px | 400 (Regular) | 20px | Descriptions, paragraph text |
| Body Small | 13px | 400 | 18px | Meta info (location, date, "8 Going") |
| Caption | 12px | 500 | 16px | Timestamps, tags, status bar labels |
| Price / Numeric | 16–20px | 700 | 1.2 | Ticket prices, totals — always tabular numerals |
| Button Label | 15px | 600 | 1 | All button text |

**Rules**
- Never go below 12px.
- Prices are always bold and use `--color-text-primary`, except the grand total which uses `--color-primary`.
- Truncate long event titles at 2 lines with ellipsis on cards.

---

## 3. Spacing & Layout Grid

Base unit: **4px**

| Token | Value |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |

- Screen horizontal padding: **16px** (mobile), **24px** (tablet+), **max content width 480px centered** on desktop for the ticket-purchase flow (mobile-first product even on web).
- Vertical rhythm between sections: **24px**.
- Card internal padding: **12–16px**.

---

## 4. Border Radius Scale

eTikket uses a soft, rounded, "pill-forward" language throughout.

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | Input fields, small tags/chips, stepper buttons |
| `radius-md` | 14px | Standard cards, modals, image thumbnails |
| `radius-lg` | 20px | Large event image cards, bottom sheets (top corners) |
| `radius-full` | 999px (pill) | Primary/secondary buttons, search bar, nav pill, avatar stack, badges |

Rule of thumb: **anything tappable that isn't a card is a pill.** Anything that's a content container is `radius-md` or `radius-lg`.

---

## 5. Buttons

| Variant | Height | Radius | Fill | Text | Usage |
|---|---|---|---|---|---|
| Primary | 52px | full (pill) | `#f33959` | white, 15px SemiBold | "Buy Ticket", "Confirm Payment" |
| Primary (disabled) | 52px | full | `#f9c2cb` | white 70% | Buy button before ticket qty selected |
| Secondary / Outline | 48px | full | transparent, 1.5px border `--color-border` | `--color-text-primary` | "Save For Later", "Message" |
| Ghost / Text | 40px | — | none | `--color-primary` | "See All", inline links |
| Icon Button | 40x40px | full | `--color-surface-alt` or `rgba(255,255,255,0.9)` on images | icon `--color-text-primary` | Back, share, bookmark, notification |
| Stepper (+/-) | 32x32px | full | `--color-surface-alt`, border 1px | `--color-text-primary` | Ticket quantity selector |
| FAB (Discover/Add) | 56x56px | full | `--color-primary` gradient or flat | white icon | Central nav "create/discover" action |

**States**
- Hover/press: darken fill 8–10% (`--color-primary-hover`) or add subtle scale (0.97) on tap.
- Focus ring: 2px `--color-primary` at 30% opacity, offset 2px — for keyboard/web accessibility.
- Loading state: label replaced with a small white spinner, button width preserved (no layout shift).
- Disabled: 40% opacity or muted tint, no shadow, no pointer cursor.

---

## 6. Cards

### Event Card (Discovery / list)
- Radius: `radius-lg` (20px) for the image, `radius-md` for the card container.
- Structure: full-bleed event image (16:10) → attendee avatar stack + "N Going" pill top-left over image → bookmark icon top-right over image → below image: title (Body Large, bold), location + date (Body Small, `--color-text-secondary`), price pill right-aligned.
- Background: `--color-surface` (#fff) with 1px `--color-border`, no heavy shadow — rely on white-on-`#fafafa` contrast. Optional soft shadow: `0 2px 8px rgba(15,15,16,0.06)`.

### Split / Payment Card (list row style)
- Radius: `radius-md` (14px)
- Compact horizontal row: title + due date on left, amount (bold, primary or dark) on right.
- Divider `1px --color-border` between rows instead of individual card shadows when stacked in a list.

### Ticket Type Card (on Event Details / checkout)
- Radius: `radius-md`
- Row layout: ticket name + price (left) — stepper control (right).
- Background `--color-surface-alt` when unselected, `--color-primary-tint-10` with `1px solid --color-primary` border when quantity > 0.

### QR Ticket Card (post-purchase)
- Radius: `radius-lg`
- White card, dashed divider (1px dashed `--color-border`) separating event info (top) from QR code block (bottom), evoking a real ticket stub.
- QR code centered, min 160x160px, high contrast on pure white — never place QR on tinted background.

---

## 7. Loaders & Skeleton Screens

- **Skeleton screens**, not spinners, for content-heavy loads (event list, event details). Use `--color-surface-alt` base with a shimmer sweep (`--color-border` → `#fff` → `--color-border`, 1.5s ease-in-out loop).
- Skeleton shapes mirror final layout: image block (`radius-lg`), two text lines (`radius-sm`, 60% and 40% width).
- **Inline spinners** (small circular, 20px, `--color-primary` stroke on transparent track) reserved for button loading states and pull-to-refresh.
- **Full-screen loader** only for payment processing (STK Push wait state): centered animated pulse in `--color-primary`, with status text below ("Waiting for M-Pesa confirmation…") and a subtle countdown/progress bar in `--color-primary-tint-20` track / `--color-primary` fill.
- Payment states always resolve to a clear success (`--color-success` check, animated draw-in) or failure (`--color-error` icon + retry button) screen — never leave the user on an ambiguous loader beyond ~60s.

---

## 8. Modals & Bottom Sheets

- Web desktop: centered modal, `radius-md` (14–16px), max-width 420px, `--color-surface` background, backdrop `--color-overlay`.
- Mobile / web-mobile: bottom sheet pattern, `radius-lg` on top two corners only, drag handle bar (36x4px, `--color-border`, pill) centered at top.
- Padding: 20–24px.
- Primary action button pinned to bottom of sheet, full width, with 16px safe-area padding below.
- Use for: ticket quantity confirmation, guest checkout email/phone capture, payment method selection, share sheet, QR scan result (success/fail).
- Dismiss via: swipe-down (sheet), tap-outside or explicit close icon (modal) — never dismiss silently during an active payment.

---

## 9. Forms & Inputs

- Height: 48px, `radius-sm` (8px), background `--color-surface-alt`, no visible border by default; on focus: `1.5px solid --color-primary` + white background.
- Label: Caption size, `--color-text-secondary`, above field.
- Search bar: pill radius (full), `--color-surface-alt` fill, leading search icon, trailing filter icon in a circular button.
- Guest checkout keeps forms minimal: name, phone (for M-Pesa), email (optional) — no password field, since guest flow requires no account.
- Validation: inline, `--color-error` text (Caption size) below field + red border, no blocking modals for simple field errors.

---

## 10. Navigation

- **Bottom nav (mobile):** dark pill-shaped floating bar, `--color-dark-surface`, `radius-full`, 4–5 icon items, active item in `--color-primary` with a filled background dot/pill behind icon. Central item can be an elevated circular FAB overlapping the bar.
- **Top bar:** transparent or `--color-surface`, back button as circular icon button, page title centered (H1) or left-aligned depending on context, action icons (share, bookmark) right-aligned.
- **Tabs/segmented control:** pill container `--color-surface-alt`, active segment `--color-surface` with soft shadow, `radius-full`.

---

## 11. Status & Badges

| State | Style |
|---|---|
| "N Going" avatar+count pill | Overlapping circular avatars (24px, white 2px border) + dark pill (`--color-dark-surface`, white text, Caption size) |
| Price badge | White pill on image, bold text, small shadow for legibility over photos |
| Payment: Success | `--color-success` background tint, checkmark icon, dark green text |
| Payment: Pending | `--color-warning` tint, clock icon |
| Payment: Failed | `--color-error` tint, alert icon |
| Sold Out | `--color-text-muted` fill, white text, card image at 60% opacity + grayscale |

---

## 12. Elevation

Kept minimal and soft — this system leans on flat color contrast (white cards on `#fafafa`) rather than heavy shadows.

| Level | Shadow |
|---|---|
| 0 (flat) | none — default for in-page cards |
| 1 (raised) | `0 2px 8px rgba(15,15,16,0.06)` — floating nav, sticky buy bar |
| 2 (overlay) | `0 8px 24px rgba(15,15,16,0.12)` — modals, bottom sheets, dropdowns |

---

## 13. Iconography

- Style: outline icons, 1.5–2px stroke weight, rounded line caps — matches the soft/rounded brand language.
- Default size: 20px (inline), 24px (nav/header).
- Icon color: `--color-text-primary` on light surfaces, `#ffffff` on dark/image surfaces or `--color-primary` when indicating an active/selected state (e.g. filled bookmark).

---

## 14. Motion

- Standard easing: `cubic-bezier(0.4, 0, 0.2, 1)`, 200–250ms for taps/hovers, 300–350ms for sheet/modal enter, 150ms exit.
- Stepper +/- changes animate the number with a quick fade/slide (120ms).
- QR success screen: checkmark draws in (400ms) before revealing ticket card.