import { useMemo, useState } from "react";
import "./App.css";
import Dropdown from "./components/Common/Dropdown";
import Sidebar from "./components/Common/Sidebar";
import MonthlyCalendar from "./components/Calendar/MonthlyCalendar";
import EventChip from "./components/Calendar/EventChip";
import BookingCard from "./components/BookingCard/BookingCard";
import BookingDetails from "./components/BookingCard/BookingDetails";
import mockData from "./data/mockData.json";
import type { Booking, MockData } from "./types/mockData";
import { formatDateKey } from "./utils/calendar";
import { groupBookingsByDate } from "./utils/bookings";

const data = mockData as MockData;
const MAX_VISIBLE_EVENTS = 2;

type SidebarView = { type: "day"; date: Date } | { type: "booking"; booking: Booking };

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
      setSidebarView({ type: "day", date });
    } else {
      setSidebarView(null);
    }
  }

  const sidebarTitle =
    sidebarView?.type === "booking"
      ? "Booking Details"
      : sidebarView?.type === "day"
        ? sidebarView.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{data.company.name}</h1>
        <div className="w-64">
          <Dropdown
            options={data.venues.map((v) => ({ label: v.name, value: v.id }))}
            value={venueId}
            onChange={setVenueId}
          />
        </div>
      </div>

      <MonthlyCalendar
        value={selectedDate}
        onChange={handleDateClick}
        renderDay={(date) => {
          const dayBookings = bookingsByDate.get(formatDateKey(date)) ?? [];
          const visible = dayBookings.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = dayBookings.length - visible.length;

          return (
            <div className="flex w-full flex-col gap-0.5">
              {visible.map((booking) => (
                <EventChip
                  key={booking.id}
                  booking={booking}
                  onClick={(b) => setSidebarView({ type: "booking", booking: b })}
                />
              ))}
              {hiddenCount > 0 && (
                <span className="px-0.5 text-[11px] font-medium text-gray-500">+{hiddenCount} more</span>
              )}
            </div>
          );
        }}
      />

      <Sidebar isOpen={sidebarView !== null} onClose={() => setSidebarView(null)} title={sidebarTitle}>
        {sidebarView?.type === "booking" && (
          <BookingDetails
            booking={sidebarView.booking}
            venueName={getVenueName(sidebarView.booking.venue)}
            hallName={getHallName(sidebarView.booking.hall)}
          />
        )}
        {sidebarView?.type === "day" && (
          <div className="flex flex-col gap-2">
            {(bookingsByDate.get(formatDateKey(sidebarView.date)) ?? []).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={(b) => setSidebarView({ type: "booking", booking: b })}
              />
            ))}
          </div>
        )}
      </Sidebar>
    </div>
  );
}

export default App;
