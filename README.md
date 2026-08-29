# Multi-Venue Availability Calendar

A monthly/weekly availability calendar for venue managers to view, filter, and manage
bookings across venues and halls — built for the Ibento Full Stack Engineer assessment.

## Tech Stack

- React 19 + TypeScript
- Vite (with the rolldown-powered build)
- Tailwind CSS v4

## Getting Started

```bash
npm install
npm run dev
```

> **Node version:** this project's Vite/rolldown toolchain requires **Node 20.12+**
> (needs the `node:util` `styleText` export). If your default `node` is older
> (`node --version`), switch first — e.g. with nvm: `nvm use 20` (or newer, `nvm use 24`
> also works) — before running `npm run dev`.

## Features

- **Month and week views** with navigation (prev/next, "Today", and a month/year picker).
- **Venue and hall filtering**, plus **search by event or customer name**.
- **Multi-day bookings render as spanning bars**; single-day bookings render as chips —
  both share a per-day overflow budget with a "+N more" affordance into a day-detail view.
- **Booking detail sidebar**: clicking a date or a booking opens a panel with the full
  booking record, plus the other bookings sharing that day.
- **Drag-and-drop rescheduling**: drag a chip or bar to a new day to move that booking,
  preserving its original duration.
- **Light/dark theme toggle**, persisted and defaulting to the OS preference.
- **Loading skeletons** for the calendar grid (simulated here, since there's no real
  backend yet — see [Notes](#notes--tradeoffs)).
- Booking changes (currently just drag-and-drop moves) **persist to `localStorage`**
  across reloads.

## Mock Data

Data lives in [src/data/mockData.json](src/data/mockData.json) and follows the hierarchy
**Company → Venue → Hall → Booking**:

- **Company** – top-level org
- **Venue** – belongs to a company, contains a list of **halls**
- **Booking** – made against a hall (`customer`, `event`, `startDate`/`startTime`,
  `endDate`/`endTime`, `venue`, `hall`, `status`, `guests`)

Types for these are defined in [src/types/mockData.ts](src/types/mockData.ts).

## Project Structure

```
src/
├── components/
│   ├── Calendar/     # MonthlyCalendar, WeekRow, DayCell, EventBar/EventChip/EventList,
│   │                 # CalendarSkeleton — generic, booking-agnostic where possible
│   ├── Header/       # Toolbar: venue/hall/search, nav, month picker
│   ├── BookingCard/  # BookingCard, BookingDetails, BookingSidebar — booking-specific
│   ├── Common/        # Dropdown, Sidebar, DetailRow, StatusBadge, SearchInput,
│   │                 # MonthPicker, ThemeToggle, Skeleton — reusable UI primitives
│   ├── BookingModal/ # reserved, unused
│   └── Filters/      # reserved, unused
├── hooks/            # useTheme, useLocalStorage
├── store/            # ThemeContext (React Context + provider)
├── utils/            # calendar.ts (date/grid math), eventBars.ts (bar layout/lanes),
│                     # bookings.ts (grouping bookings by date)
├── types/            # mockData.ts — Booking/Venue/Hall/Company types
└── data/             # mock data
```

## Approach & Architectural Decisions

**Calendar internals are decoupled from the booking domain.** `MonthlyCalendar` and
`WeekRow` don't import the `Booking` type at all — they work off a generic `RangeEvent`
shape (`{ id, label, startDate, endDate, className }`) for the spanning-bar layout, and a
`renderDay(date)` render-prop for whatever a consumer wants to show inside a day cell.
`App.tsx` is the only place that knows about bookings: it splits them into single-day
(rendered as `EventChip`s via `EventList`) and multi-day (rendered as `EventBar`s via the
calendar's own lane-packing algorithm in `utils/eventBars.ts`) and wires click handlers
into the sidebar. This means the calendar shell could be reused for a different domain
without touching booking logic.

**State lives in `App.tsx`, not in the calendar components.** The visible month/week,
selected date, and sidebar view are owned by `App` and passed down as props — the
calendar components are otherwise presentational. This keeps the "which day is
selected / what's in the sidebar" logic in one place instead of scattered across
components that would each need to know about siblings, day-lists, etc.

**Theme uses React Context, not prop-drilling.** `ThemeProvider` (in `store/`) owns the
`dark`/`light` state, toggles a `dark` class on `<html>` (paired with Tailwind v4's
`@custom-variant dark` in `index.css`), and persists the choice to `localStorage`. Any
component can read/toggle it via the `useTheme()` hook without threading props through
intermediate components.

**Drag-and-drop uses the native HTML5 DnD API**, not a library — `EventChip`/`EventBar`
are `draggable` and put the booking id in `dataTransfer`; `DayCell` is the drop target.
This avoids a dependency for a fairly small interaction surface.

**Booking data persistence is minimal by design.** Only `bookings` (the one thing the app
actually mutates, via drag-and-drop) persists to `localStorage`, via a small generic
`useLocalStorage` hook. View-only state (selected venue/hall, search text, visible month)
intentionally does *not* persist — it's UI state, not data, so a fresh visit should start
from a clean view.

## Notes / Tradeoffs

- There's no backend — `mockData.json` is loaded statically and `bookings` state is
  seeded from it, then persisted to `localStorage` on change. A real version would swap
  `useLocalStorage` for a data-fetching hook and drop the simulated loading delay in
  `App.tsx`.
- The loading skeleton is simulated with a `setTimeout` on venue/hall change, since there's
  no real request to be pending on. It's there to demonstrate the pattern, not because the
  static JSON import is actually slow.
- Drag-and-drop doesn't validate for double-booking conflicts on drop — out of scope for
  the time budget, but the natural next step (`utils/bookings.ts` already groups bookings
  by date, so a conflict check would slot in there).
