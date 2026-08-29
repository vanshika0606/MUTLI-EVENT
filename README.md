# Multi-Venue Availability Calendar

A monthly and weekly availability calendar for venue managers to view, filter, and manage bookings across venues and halls. Built for the Ibento Full Stack Engineer assessment.

## Tech Stack

* React 19 + TypeScript
* Vite
* Tailwind CSS v4

## Getting Started

```bash
npm install
npm run dev
```

**Node version:** This project requires **Node 20.12+**. You can check your current version with:

```bash
node --version
```

If you use nvm and have an older version:

```bash
nvm use 20
```

Node 24 also works.

## Features

* **Month and week views** with previous/next navigation, a "Today" button, and a month/year picker.
* **Venue and hall filtering**.
* **Search by event or customer name**.
* **Single-day bookings** are shown as chips and **multi-day bookings** are shown as spanning bars.
* A **"+N more"** option is shown when a day has more bookings than can fit.
* **Booking details sidebar** that opens when a date or booking is clicked.
* **Drag-and-drop booking rescheduling** while preserving the original booking duration.
* **Light and dark mode**, saved in `localStorage`.
* **Loading skeletons** for the calendar.
* Booking changes made through drag-and-drop are saved in **localStorage**.

## Mock Data

Mock data is available in:

`src/data/mockData.json`

The data follows this structure:

**Company → Venue → Hall → Booking**

* **Company** – Top-level organization.
* **Venue** – Belongs to a company and contains one or more halls.
* **Booking** – Created against a hall and contains customer, event, date/time, venue, hall, status, and guest information.

The TypeScript types are defined in:

`src/types/mockData.ts`

## Project Structure

```text
src/
├── components/
│   ├── Calendar/       # Calendar components
│   ├── Header/         # Filters, navigation and month picker
│   ├── BookingCard/    # Booking details and sidebar
│   ├── Common/         # Reusable UI components
│   ├── BookingModal/   # Reserved for future use
│   └── Filters/        # Reserved for future use
│
├── hooks/              # Custom hooks
├── store/              # Theme context
├── utils/              # Date, calendar and booking utilities
├── types/              # TypeScript types
└── data/               # Mock data
```

## Approach & Architectural Decisions

### Reusable calendar

The calendar components are kept separate from the booking-specific logic.

`MonthlyCalendar` and `WeekRow` use a generic event structure for displaying multi-day events. This allows the calendar components to be reused without depending directly on the `Booking` type.

The booking logic is mainly handled in `App.tsx`, where bookings are separated into single-day and multi-day bookings and connected to the booking sidebar.

### State management

The main application state, such as the selected month, date, and sidebar state, is managed in `App.tsx`.

Calendar components receive data and callbacks through props, which keeps the components focused mainly on displaying the UI.

### Theme management

The theme is managed using React Context.

The `ThemeProvider` handles light/dark mode, updates the `dark` class on the HTML element, and saves the selected theme in `localStorage`.

Components can access and change the theme using the `useTheme()` hook without passing theme props through multiple components.

### Drag and drop

Native HTML5 drag-and-drop is used instead of an external library.

Booking cards are draggable, and calendar day cells act as drop targets. This keeps the implementation simple without adding another dependency.

### Data persistence

Only booking changes are saved in `localStorage`.

Other UI state, such as selected filters, search text, and the visible month, is not persisted because it is temporary UI state.

## Notes / Tradeoffs

* There is no backend. The application starts with mock data from `mockData.json`, and booking changes are saved in `localStorage`.
* The loading skeleton is simulated because there is no real API request.
* Drag-and-drop does not currently check for double-booking conflicts. This was kept out of scope due to the assessment time limit.
* In a production application, mock data and `localStorage` could be replaced with API calls and backend data persistence.
