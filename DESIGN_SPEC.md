# Design Specification: Minimalist Modern Movie Ticket Booking

## Principal Design Document v1.0

---

## 1. Design Philosophy & Visual Language

### Core Principles
- **Reductive Clarity** — Every element earns its place; remove until only the essential remains.
- **Typographic Hierarchy** — Information architecture communicated through weight, size, and spacing rather than decoration.
- **Intentional Whitespace** — Generous breathing room creates a premium, gallery-like feel.
- **Single Accent Discipline** — One striking primary color against a neutral foundation prevents visual noise.

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#E50914` | Primary CTA, active states, key highlights |
| `--accent-hover` | `#FF1A24` | Hover/pressed state for accent elements |
| `--surface-primary` | `#0A0A0A` | Page background |
| `--surface-elevated` | `#111115` | Cards, panels, modals |
| `--surface-subtle` | `#1A1A1F` | Inset areas, disabled states |
| `--border-default` | `#1E1E24` | Subtle dividers |
| `--border-strong` | `#2A2A32` | Emphasized borders |
| `--text-primary` | `#FFFFFF` | Headings, key info |
| `--text-secondary` | `#CCCCCC` | Body text |
| `--text-tertiary` | `#888888` | Labels, meta info |
| `--text-muted` | `#555555` | Captions, disabled text |
| `--radius-sm` | `4px` | Small elements (chips, tags) |
| `--radius-md` | `8px` | Cards, buttons |
| `--radius-lg` | `16px` | Hero sections, ticket card |
| `--radius-full` | `9999px` | Pills, badges |

### Typography Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | 3rem (48px) | 800 | 1.1 | Movie title hero |
| H1 | 2rem (32px) | 700 | 1.25 | Section headings |
| H2 | 1.5rem (24px) | 600 | 1.3 | Sub-headings |
| Body | 1rem (16px) | 400 | 1.6 | Paragraphs, descriptions |
| Caption | 0.875rem (14px) | 500 | 1.4 | Meta info, labels |
| Micro | 0.75rem (12px) | 600 | 1.3 | Tags, overline text |

**Font Stack:** `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`  
**Monospace:** `'Geist Mono', 'SF Mono', 'Fira Code', monospace`

---

## 2. View 1: Movie Details Page

### 2.1 Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ NAVIGATION BAR                                                           │
│ [← Back]                              [Logo]            [My Bookings]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     HERO SECTION                                  │    │
│  │                                                                   │    │
│  │   ┌──────────┐                                                   │    │
│  │   │          │    MOVIE TITLE                                    │    │
│  │   │  POSTER  │    ★ 8.7  ·  2h 32m                              │    │
│  │   │  (2:3)   │                                                   │    │
│  │   │          │    [Sci-Fi]  [Action]  [Drama]                    │    │
│  │   │          │                                                   │    │
│  │   │          │    Synopsis text lorem ipsum dolor sit amet...     │    │
│  │   │          │    Truncated at 3 lines with "Read more"          │    │
│  │   └──────────┘                                                   │    │
│  │                                                                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                                                          │
│  SHOWTIMES                                        Select Date ↓          │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [Today]  [Mon 19]  [Tue 20]  [Wed 21]  [Thu 22]  [Fri 23] →   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Cinema Name                                                      │   │
│  │  Location                                                         │   │
│  │                                                                   │   │
│  │  [10:30 AM]  [1:15 PM]  [4:00 PM]  [7:30 PM]  [10:45 PM]       │   │
│  │              ↑ selected                                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Another Cinema                                                   │   │
│  │  Downtown                                                         │   │
│  │                                                                   │   │
│  │  [11:00 AM]  [2:30 PM]  [6:00 PM]  [9:15 PM]                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│         ┌───────────────────────────────────────────┐                   │
│         │       🎬  BOOK TICKET  —  $12.00          │                   │
│         └───────────────────────────────────────────┘                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Hero Section Specifications

**Container:**
- Max-width: `1200px`, centered with `auto` margins
- Padding: `3rem 2rem`
- Background: `--surface-primary` with optional gradient overlay on backdrop image

**Poster:**
- Aspect ratio: `2:3`
- Width: `280px` (fixed on desktop)
- Border-radius: `--radius-md` (8px)
- Box-shadow: `0 8px 32px rgba(0, 0, 0, 0.4)`
- Object-fit: `cover`
- Fallback: Solid `--surface-subtle` with centered film icon

**Content Area (right of poster):**
- Gap from poster: `3rem`
- Vertical alignment: `center`

**Title:**
- Font: Display (48px / weight 800)
- Color: `--text-primary`
- Letter-spacing: `-0.02em`
- Margin-bottom: `0.75rem`

**Rating & Duration Row:**
- Layout: Inline flex, items center, gap `1rem`
- Rating: Star icon (filled, `--accent`) + number (Caption size, `--text-secondary`)
- Separator: `·` character in `--text-muted`
- Duration: Clock icon + text (Caption size, `--text-secondary`)
- Margin-bottom: `1.25rem`

**Genre Tags:**
- Layout: Flex wrap, gap `0.5rem`
- Each tag: 
  - Background: `transparent`
  - Border: `1px solid --border-strong`
  - Padding: `0.25rem 0.75rem`
  - Border-radius: `--radius-full`
  - Font: Micro (12px / weight 600)
  - Color: `--text-tertiary`
  - Text-transform: `uppercase`
  - Letter-spacing: `0.05em`
- Margin-bottom: `1.5rem`

**Synopsis:**
- Font: Body (16px / weight 400)
- Color: `--text-secondary`
- Line-height: `1.7`
- Max-height: `calc(1.7em * 3)` (3 lines), with overflow hidden
- "Read more" toggle: Caption size, `--accent` color, no underline

### 2.3 Showtime Selector Specifications

**Section Header:**
- Label: "Showtimes" in H2 (24px / weight 600), `--text-primary`
- Top border: `1px solid --border-default`
- Padding-top: `2.5rem`
- Margin-top: `2.5rem`

**Date Tab Strip:**
- Layout: Horizontal scroll, no visible scrollbar (CSS `scrollbar-width: none`)
- Container: Full width, `padding: 0.5rem 0`
- Each date tab:
  - Default state:
    - Background: `transparent`
    - Border: `1px solid --border-default`
    - Padding: `0.6rem 1.25rem`
    - Border-radius: `--radius-full`
    - Color: `--text-tertiary`
    - Font: Caption (14px / weight 500)
  - Selected state:
    - Background: `--accent`
    - Border-color: `--accent`
    - Color: `#FFFFFF`
    - Font-weight: `600`
  - Hover state (non-selected):
    - Border-color: `--border-strong`
    - Color: `--text-secondary`
- Content format: "Today", "Mon 19", "Tue 20" etc.
- Gap between tabs: `0.5rem`
- Scroll fade: Linear gradient overlay on right edge (`--surface-primary` → transparent)

**Cinema Grouping Card:**
- Background: `--surface-elevated`
- Border: `1px solid --border-default`
- Border-radius: `--radius-md`
- Padding: `1.5rem`
- Margin-bottom: `1rem`
- Cinema name: Caption (14px / weight 600), `--text-primary`
- Cinema location: Micro (12px / weight 400), `--text-muted`

**Time Slot Chips:**
- Layout: Flex wrap, gap `0.75rem`, margin-top `1rem`
- Each chip:
  - Default:
    - Background: `--surface-subtle`
    - Border: `1px solid --border-default`
    - Padding: `0.5rem 1rem`
    - Border-radius: `--radius-sm`
    - Font: Caption (14px / weight 500)
    - Color: `--text-secondary`
    - Cursor: `pointer`
    - Transition: `all 0.15s ease`
  - Hover:
    - Border-color: `--accent`
    - Color: `--text-primary`
    - Background: `rgba(229, 9, 20, 0.08)`
  - Selected:
    - Background: `--accent`
    - Border-color: `--accent`
    - Color: `#FFFFFF`
    - Font-weight: `600`
    - Box-shadow: `0 2px 12px rgba(229, 9, 20, 0.3)`

### 2.4 Primary CTA (Book Ticket)

- Position: Centered below showtimes, sticky to bottom on mobile
- Min-width: `280px`
- Padding: `1rem 2.5rem`
- Background: `--accent`
- Color: `#FFFFFF`
- Font: Body (16px / weight 600)
- Border-radius: `--radius-md`
- Letter-spacing: `0.02em`
- Box-shadow: `0 4px 20px rgba(229, 9, 20, 0.35)`
- Hover: Background `--accent-hover`, shadow expands, subtle `translateY(-1px)`
- Disabled: Background `--surface-subtle`, color `--text-muted`, no shadow
- Transition: `all 0.2s ease`
- Content: Film emoji + "Book Ticket" + price display

---

## 3. View 2: Digital Ticket View

### 3.1 Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ NAVIGATION BAR                                                           │
│ [← My Bookings]                      [Logo]               [Account]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                    Booking Confirmed ✓                                   │
│                    Booking #MTB-2847                                     │
│                                                                          │
│         ┌───────────────────────────────────────────────┐               │
│         │                                               │               │
│         │          ┌─────────────┐                      │               │
│         │          │             │                      │               │
│         │          │   POSTER    │    MOVIE TITLE       │               │
│         │          │   (small)   │    Genre · Duration  │               │
│         │          │             │                      │               │
│         │          └─────────────┘                      │               │
│         │                                               │               │
│         │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │               │
│         │                                               │               │
│         │   DATE           TIME           SCREEN        │               │
│         │   Mon, Aug 19    7:30 PM        Screen 3      │               │
│         │                                               │               │
│         │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │               │
│         │                                               │               │
│         │   SEATS                         TOTAL         │               │
│         │   F7, F8, F9                    $36.00        │               │
│         │                                               │               │
│         │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │               │
│         │                                               │               │
│         │         ┌─────────────────────┐               │               │
│         │         │                     │               │               │
│         │         │     QR CODE         │               │               │
│         │         │    PLACEHOLDER      │               │               │
│         │         │                     │               │               │
│         │         └─────────────────────┘               │               │
│         │              MTB-2847-F7F8F9                   │               │
│         │                                               │               │
│         └───────────────────────────────────────────────┘               │
│                                                                          │
│         [  Save Ticket  ]     [  Download PDF  ]                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Ticket Card Specifications

**Page Container:**
- Background: `--surface-primary`
- Display: `flex`, justify `center`, align `center`
- Min-height: `calc(100vh - nav height)`
- Padding: `3rem 1.5rem`

**Success Header (above card):**
- Checkmark: Circular badge, 48px, `--accent` background, white check icon
- "Booking Confirmed": H2 (24px / weight 600), `--text-primary`
- Booking ID: Caption (14px / weight 500), `--text-muted`, monospace font
- Margin-bottom: `2rem`
- Text-align: `center`

**Ticket Card Container:**
- Width: `480px` max, `100%` responsive
- Background: `--surface-elevated`
- Border: `1px solid --border-default`
- Border-radius: `--radius-lg` (16px)
- Overflow: `hidden`
- Box-shadow: `0 4px 24px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1)`

**Ticket Header (movie info):**
- Padding: `1.75rem`
- Layout: Flex row, gap `1.25rem`, align center
- Poster thumbnail: `64px × 96px`, border-radius `--radius-sm`, object-fit cover
- Movie title: H2 (24px / weight 700), `--text-primary`
- Genre + duration: Caption (14px / weight 400), `--text-tertiary`

**Dashed Divider:**
- Implementation: `border-top: 2px dashed --border-default`
- Margin: `0 1.75rem`
- Decorative notch: Two circular cutouts (12px diameter) at left and right edges, colored `--surface-primary` to create the tear-off ticket illusion

**Details Grid:**
- Padding: `1.75rem`
- Layout: CSS Grid, `grid-template-columns: 1fr 1fr 1fr` (first row), `1fr 1fr` (second row)
- Row gap: `1.5rem`

**Each Detail Cell:**
- Label: Micro (12px / weight 600), `--text-muted`, text-transform `uppercase`, letter-spacing `0.08em`
- Value: Caption (14px / weight 600), `--text-primary`
- Gap between label and value: `0.35rem`

**Detail Cells Layout:**
| Row 1 | DATE | TIME | SCREEN |
|--------|------|------|--------|
| Row 2 | SEATS | | TOTAL |

**QR/Barcode Section:**
- Padding: `1.5rem 1.75rem 1.75rem`
- Border-top: `2px dashed --border-default` (with notch cutouts)
- Align: `center`

**QR Code Placeholder:**
- Size: `140px × 140px`
- Background: `#FFFFFF`
- Border-radius: `--radius-sm`
- Contains: Stylized QR grid pattern or placeholder icon
- Below QR: Booking reference in monospace, Micro (12px), `--text-muted`, margin-top `0.75rem`

### 3.3 Action Buttons

**Button Row:**
- Layout: Flex, justify `center`, gap `1rem`
- Margin-top: `2rem`

**Save Ticket (Primary):**
- Background: `--accent`
- Color: `#FFFFFF`
- Padding: `0.75rem 1.75rem`
- Border-radius: `--radius-md`
- Font: Caption (14px / weight 600)
- Icon: Bookmark/save icon left-aligned
- Hover: Background `--accent-hover`, `translateY(-1px)`

**Download PDF (Secondary):**
- Background: `transparent`
- Border: `1px solid --border-strong`
- Color: `--text-secondary`
- Padding: `0.75rem 1.75rem`
- Border-radius: `--radius-md`
- Font: Caption (14px / weight 600)
- Icon: Download icon left-aligned
- Hover: Border-color `--text-tertiary`, color `--text-primary`

---

## 4. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Desktop XL | >1440px | Max-width container, extra whitespace |
| Desktop | 1024–1440px | Default layout as specified |
| Tablet | 768–1023px | Hero stacks vertically, poster centered above content |
| Mobile | <768px | Full stack, CTA becomes sticky bottom bar |

### Movie Details Page — Mobile Adaptations
- Hero poster: Full width, aspect-ratio `16:9` crop (backdrop style), max-height `240px`
- Title/meta: Below poster, left-aligned, reduced sizes (Display → 32px)
- Genre tags: Horizontal scroll instead of wrap
- Date tabs: Horizontal scroll (natural behavior maintained)
- Time chips: 2-column grid instead of flex-wrap
- Book Ticket CTA: Fixed bottom bar, full width, `padding: 1rem`, `z-index: 50`

### Digital Ticket — Mobile Adaptations
- Card width: `100%` with `1rem` horizontal padding
- Details grid: 2-column on all rows
- QR code: Scaled to `120px`
- Buttons: Stack vertically, full width

---

## 5. Interaction & Motion Design

### Micro-interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Date tab select | Click | Background color crossfade `150ms ease` |
| Time chip select | Click | Scale `1.02` + color fill `150ms ease-out` |
| Book Ticket CTA | Hover | `translateY(-1px)` + shadow expand `200ms ease` |
| Ticket card | Page load | `fadeInUp`: opacity `0→1`, `translateY(16px→0)`, `400ms ease-out` |
| QR code | Card visible | Delayed fade-in `200ms` after card settles |
| Success check | Page load | Scale `0→1` with slight bounce `400ms cubic-bezier(0.68, -0.55, 0.27, 1.55)` |
| Genre tag | Hover | Border-color transition `150ms` |
| Poster | Page load | Fade from placeholder `300ms ease` |

### Scroll Behavior
- Smooth scroll (`scroll-behavior: smooth`)
- Date strip: Overflow scroll with momentum (`-webkit-overflow-scrolling: touch`)
- Showtime section: `scroll-margin-top: 2rem` for anchor navigation

---

## 6. Accessibility Requirements

- All interactive elements have minimum `44px × 44px` touch targets
- Focus indicators: `2px solid --accent`, `2px offset`, visible on keyboard navigation
- Color contrast: All text meets WCAG 2.1 AA (4.5:1 for body, 3:1 for large text)
- Screen reader: ARIA labels on icon-only buttons, `role="tablist"` for date strip, `role="tab"` for date tabs
- Time chips: `role="radio"` with `aria-checked`, grouped in `role="radiogroup"`
- Genre tags: Semantic `<ul>` with `<li>` items
- Ticket card: Landmark `<article>` with descriptive `aria-label`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables transforms and animations

---

## 7. Component Inventory

### New Components Required

| Component | Type | Location |
|-----------|------|----------|
| `MovieHero` | Server Component | `components/MovieHero.js` |
| `GenreTagList` | Server Component | `components/GenreTagList.js` |
| `ShowtimePicker` | Client Component | `components/ShowtimePicker.js` |
| `DateTabStrip` | Client Component | `components/DateTabStrip.js` |
| `TimeChip` | Client Component | `components/TimeChip.js` |
| `DigitalTicket` | Server Component | `components/DigitalTicket.js` |
| `TicketDetailCell` | Server Component | `components/TicketDetailCell.js` |
| `QRPlaceholder` | Server Component | `components/QRPlaceholder.js` |
| `TicketActions` | Client Component | `components/TicketActions.js` |

### Existing Components to Refine
- `MovieCard.js` — Align with new typography/spacing tokens
- `SeatSelector.js` — Ensure consistent accent color usage

---

## 8. Data Requirements

### Movie Details Page

```javascript
// Required data shape
{
  id: number,
  title: string,
  description: string,
  duration_minutes: number,
  genre: string,            // Split by comma/slash for multiple tags
  poster_url: string | null,
  rating: number | null,    // Future: needs backend addition
  showtimes: [
    {
      id: number,
      start_time: string,   // ISO datetime
      price: number,
      cinema: {
        id: number,
        name: string,
        location: string
      }
    }
  ]
}
```

### Digital Ticket View

```javascript
// Required data shape
{
  booking_id: number,
  reference: string,        // Formatted: "MTB-{id}"
  status: string,
  booking_time: string,
  movie: {
    title: string,
    genre: string,
    duration_minutes: number,
    poster_url: string | null
  },
  showtime: {
    start_time: string,
    price: number,
    cinema: {
      name: string,
      screen: string       // Future: needs backend addition
    }
  },
  seats: [
    { row_label: string, seat_number: number }
  ],
  total_price: number       // Computed: price * seats.length
}
```

---

## 9. Implementation Priority

### Phase 1 — Core Visual Upgrade
1. Define CSS custom properties (design tokens) in `globals.css`
2. Implement `MovieHero` component with poster + content layout
3. Style genre tags, rating badge, and duration display
4. Create the dashed-divider ticket illusion with CSS notch cutouts

### Phase 2 — Interactive Showtime Selector
5. Build `DateTabStrip` with horizontal scroll and active state
6. Build `ShowtimePicker` grouping showtimes by cinema and date
7. Implement `TimeChip` with selection state management
8. Wire up "Book Ticket" CTA to navigate to seat selection

### Phase 3 — Digital Ticket
9. Design and build `DigitalTicket` card layout
10. Add QR placeholder with booking reference
11. Create `TicketActions` with save/download functionality
12. Add page-load animation sequence

### Phase 4 — Polish & Responsive
13. Implement all responsive breakpoints
14. Add micro-interactions and transitions
15. Accessibility audit and ARIA implementation
16. Performance optimization (poster lazy loading, font subsetting)

---

## 10. Visual Reference — CSS Implementation Sketch

```css
/* ── Design Tokens ──────────────────────────────────────────────── */

:root {
  --accent: #E50914;
  --accent-hover: #FF1A24;
  --surface-primary: #0A0A0A;
  --surface-elevated: #111115;
  --surface-subtle: #1A1A1F;
  --border-default: #1E1E24;
  --border-strong: #2A2A32;
  --text-primary: #FFFFFF;
  --text-secondary: #CCCCCC;
  --text-tertiary: #888888;
  --text-muted: #555555;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}

/* ── Movie Hero ─────────────────────────────────────────────────── */

.movie-hero {
  display: flex;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.movie-hero__poster {
  width: 280px;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-md);
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.movie-hero__title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 0.75rem;
}

.movie-hero__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

.movie-hero__rating {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--accent);
  font-weight: 600;
}

.movie-hero__synopsis {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 560px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Genre Tags ─────────────────────────────────────────────────── */

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  list-style: none;
  padding: 0;
}

.genre-tag {
  background: transparent;
  border: 1px solid var(--border-strong);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: border-color 0.15s ease;
}

.genre-tag:hover {
  border-color: var(--text-tertiary);
}

/* ── Date Tab Strip ─────────────────────────────────────────────── */

.date-strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.5rem 0;
  -webkit-overflow-scrolling: touch;
}

.date-strip::-webkit-scrollbar {
  display: none;
}

.date-tab {
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-tertiary);
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.date-tab:hover {
  border-color: var(--border-strong);
  color: var(--text-secondary);
}

.date-tab--active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 600;
}

/* ── Time Chips ─────────────────────────────────────────────────── */

.time-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.time-chip {
  padding: 0.5rem 1rem;
  background: var(--surface-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.time-chip:hover {
  border-color: var(--accent);
  color: var(--text-primary);
  background: rgba(229, 9, 20, 0.08);
}

.time-chip--selected {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(229, 9, 20, 0.3);
}

/* ── Digital Ticket Card ────────────────────────────────────────── */

.ticket-card {
  width: 100%;
  max-width: 480px;
  background: var(--surface-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2),
              0 1px 4px rgba(0, 0, 0, 0.1);
}

.ticket-card__header {
  padding: 1.75rem;
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.ticket-card__poster {
  width: 64px;
  height: 96px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.ticket-card__movie-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.ticket-card__movie-meta {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* Dashed divider with notch cutouts */
.ticket-card__divider {
  position: relative;
  border-top: 2px dashed var(--border-default);
  margin: 0 1.75rem;
}

.ticket-card__divider::before,
.ticket-card__divider::after {
  content: '';
  position: absolute;
  top: -7px;
  width: 14px;
  height: 14px;
  background: var(--surface-primary);
  border-radius: 50%;
}

.ticket-card__divider::before { left: -2.5rem; }
.ticket-card__divider::after  { right: -2.5rem; }

/* Details grid */
.ticket-card__details {
  padding: 1.75rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 1.5rem;
}

.ticket-detail__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.35rem;
}

.ticket-detail__value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* QR Section */
.ticket-card__qr {
  padding: 1.5rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.ticket-card__qr-image {
  width: 140px;
  height: 140px;
  background: #ffffff;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-card__qr-ref {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

/* ── Ticket Actions ─────────────────────────────────────────────── */

.ticket-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.ticket-actions__btn--primary {
  padding: 0.75rem 1.75rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-actions__btn--primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.ticket-actions__btn--secondary {
  padding: 0.75rem 1.75rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-actions__btn--secondary:hover {
  border-color: var(--text-tertiary);
  color: var(--text-primary);
}

/* ── Animations ─────────────────────────────────────────────────── */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 400ms ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 400ms cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-scale-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

/* ── Responsive ─────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .movie-hero {
    flex-direction: column;
    padding: 0 0 2rem;
    gap: 1.5rem;
  }

  .movie-hero__poster {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0;
    max-height: 240px;
  }

  .movie-hero__title {
    font-size: 2rem;
    padding: 0 1.5rem;
  }

  .movie-hero__meta,
  .genre-tags,
  .movie-hero__synopsis {
    padding: 0 1.5rem;
  }

  .ticket-card__details {
    grid-template-columns: 1fr 1fr;
  }

  .ticket-actions {
    flex-direction: column;
    padding: 0 1rem;
  }

  .ticket-actions__btn--primary,
  .ticket-actions__btn--secondary {
    width: 100%;
    text-align: center;
  }
}
```

---

## 11. Summary

This design system transforms the existing functional movie ticket booking app into a premium, gallery-like experience through:

1. **Restraint** — Neutral dark palette with a single red accent creates focus without noise.
2. **Typography as structure** — A clear 6-level type scale eliminates the need for decorative elements.
3. **Spatial rhythm** — Consistent padding/margin multiples of 0.25rem create visual harmony.
4. **Tactile interactions** — Subtle transforms and opacity shifts provide satisfying feedback.
5. **Ticket as artifact** — The digital ticket card with notch cutouts and dashed borders evokes a physical ticket while remaining distinctly digital.

The implementation leverages the existing Next.js 16 + Tailwind CSS v4 + custom CSS architecture already in place, requiring no new dependencies.
