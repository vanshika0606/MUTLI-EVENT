# Multi-Venue Availability Calendar

A monthly availability calendar for venue managers to view, filter, and create bookings across venues and halls.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

## Mock Data

Data lives in [src/data/mockData.json](src/data/mockData.json) and follows the hierarchy **Company → Venue → Hall → Booking**:

- **Company** – top-level org
- **Venue** – belongs to a company, contains a list of **halls**
- **Booking** – made against a hall (`customer`, `event`, `startDate`/`startTime`, `endDate`/`endTime`, `venue`, `hall`, `status`, `guests`)

Types for these are defined in [src/types/mockData.ts](src/types/mockData.ts).

## Project Structure

```
src/
├── components/   # Calendar, BookingCard, BookingModal, Filters, Header, Common
├── pages/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
└── data/         # mock data
```
