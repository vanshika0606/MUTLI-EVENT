import { useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import MonthlyCalendar from "./components/Calendar/MonthlyCalendar";
import EventList from "./components/Calendar/EventList";
import BookingSidebar, { type SidebarView } from "./components/BookingCard/BookingSidebar";
import mockData from "./data/mockData.json";
import type { MockData } from "./types/mockData";
import { formatDateKey } from "./utils/calendar";
import { groupBookingsByDate } from "./utils/bookings";

const data = mockData as MockData;

function App() {
  const [venueId, setVenueId] = useState(data.venues[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [sidebarView, setSidebarView] = useState<SidebarView | null>(null);

  const bookingsByDate = useMemo(() => {
    const venueBookings = data.bookings.filter((b) => b.venue === venueId);
    return groupBookingsByDate(venueBookings);
  }, [venueId]);

  function getVenueName(id: string) {
    return data.venues.find((v) => v.id === id)?.name ?? id;
  }

  function getHallName(id: string) {
    return data.venues.flatMap((v) => v.halls).find((h) => h.id === id)?.name ?? id;
  }

  function handleDateClick(date: Date) {
    setSelectedDate(date);
    const dayBookings = bookingsByDate.get(formatDateKey(date)) ?? [];
    if (dayBookings.length === 1) {
      setSidebarView({ type: "booking", booking: dayBookings[0] });
    } else if (dayBookings.length > 1) {
      setSidebarView({ type: "day", date, bookings: dayBookings });
    } else {
      setSidebarView(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <Header
        title={data.company.name}
        venueOptions={data.venues.map((v) => ({ label: v.name, value: v.id }))}
        venueId={venueId}
        onVenueChange={setVenueId}
      />

      <MonthlyCalendar
        value={selectedDate}
        onChange={handleDateClick}
        renderDay={(date) => (
          <EventList
            bookings={bookingsByDate.get(formatDateKey(date)) ?? []}
            onSelectBooking={(booking) => setSidebarView({ type: "booking", booking })}
          />
        )}
      />

      <BookingSidebar
        view={sidebarView}
        onClose={() => setSidebarView(null)}
        onSelectBooking={(booking) => setSidebarView({ type: "booking", booking })}
        getVenueName={getVenueName}
        getHallName={getHallName}
      />
    </div>
  );
}

export default App;
