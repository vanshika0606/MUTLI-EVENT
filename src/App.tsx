import { useMemo, useState } from "react";
import "./App.css";
import Dropdown from "./components/Common/Dropdown";
import MonthlyCalendar from "./components/Calendar/MonthlyCalendar";
import mockData from "./data/mockData.json";
import type { Booking, MockData } from "./types/mockData";
import { formatDateKey } from "./utils/calendar";
import { groupBookingsByDate } from "./utils/bookings";

const data = mockData as MockData;

const STATUS_DOT: Record<Booking["status"], string> = {
  Confirmed: "bg-emerald-500",
  Tentative: "bg-amber-500",
  Maintenance: "bg-gray-400",
};

const MAX_VISIBLE_EVENTS = 2;

function App() {
  const [venueId, setVenueId] = useState(data.venues[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const bookingsByDate = useMemo(() => {
    const venueBookings = data.bookings.filter((b) => b.venue === venueId);
    return groupBookingsByDate(venueBookings);
  }, [venueId]);

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
        onChange={setSelectedDate}
        renderDay={(date) => {
          const dayBookings = bookingsByDate.get(formatDateKey(date)) ?? [];
          const visible = dayBookings.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = dayBookings.length - visible.length;

          return (
            <div className="flex w-full flex-col gap-0.5">
              {visible.map((booking) => (
                <div key={booking.id} className="flex items-center gap-1 truncate text-[11px] text-gray-700">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[booking.status]}`} />
                  <span className="truncate">{booking.event}</span>
                </div>
              ))}
              {hiddenCount > 0 && (
                <span className="text-[11px] font-medium text-gray-500">+{hiddenCount} more</span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}

export default App;
