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
const ALL_HALLS = "all";

function App() {
  const [venueId, setVenueId] = useState(data.venues[0].id);
  const [hallId, setHallId] = useState(ALL_HALLS);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [sidebarView, setSidebarView] = useState<SidebarView | null>(null);

  const venue = data.venues.find((v) => v.id === venueId)!;

  const bookingsByDate = useMemo(() => {
    const venueBookings = data.bookings.filter(
      (b) => b.venue === venueId && (hallId === ALL_HALLS || b.hall === hallId)
    );
    return groupBookingsByDate(venueBookings);
  }, [venueId, hallId]);

  function handleVenueChange(nextVenueId: string) {
    setVenueId(nextVenueId);
    setHallId(ALL_HALLS);
  }

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
      setSidebarView({ type: "booking", booking: dayBookings[0], siblings: dayBookings });
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
        onVenueChange={handleVenueChange}
        hallOptions={[
          { label: "All Halls", value: ALL_HALLS },
          ...venue.halls.map((h) => ({ label: h.name, value: h.id })),
        ]}
        hallId={hallId}
        onHallChange={setHallId}
      />

      <MonthlyCalendar
        value={selectedDate}
        onChange={handleDateClick}
        renderDay={(date) => (
          <EventList
            bookings={bookingsByDate.get(formatDateKey(date)) ?? []}
            onSelectBooking={(booking, siblings) => setSidebarView({ type: "booking", booking, siblings })}
            onShowMore={(dayBookings) => setSidebarView({ type: "day", date, bookings: dayBookings })}
          />
        )}
      />

      <BookingSidebar
        view={sidebarView}
        onClose={() => setSidebarView(null)}
        onSelectBooking={(booking, siblings) => setSidebarView({ type: "booking", booking, siblings })}
        getVenueName={getVenueName}
        getHallName={getHallName}
      />
    </div>
  );
}

export default App;
