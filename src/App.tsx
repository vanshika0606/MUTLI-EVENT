import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import MonthlyCalendar from "./components/Calendar/MonthlyCalendar";
import CalendarSkeleton from "./components/Calendar/CalendarSkeleton";
import EventList from "./components/Calendar/EventList";
import BookingSidebar, { type SidebarView } from "./components/BookingCard/BookingSidebar";
import ThemeToggle from "./components/Common/ThemeToggle";
import mockData from "./data/mockData.json";
import type { Booking, MockData } from "./types/mockData";
import { formatDateKey } from "./utils/calendar";
import { groupBookingsByDate } from "./utils/bookings";
import type { RangeEvent } from "./utils/eventBars";
import { useTheme } from "./hooks/useTheme";

const data = mockData as MockData;
const ALL_HALLS = "all";

const STATUS_BAR_STYLES: Record<Booking["status"], string> = {
  Confirmed: "bg-emerald-600 text-white",
  Tentative: "bg-amber-500 text-white",
  Maintenance: "bg-gray-500 text-white",
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const [venueId, setVenueId] = useState(data.venues[0].id);
  const [hallId, setHallId] = useState(ALL_HALLS);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [sidebarView, setSidebarView] = useState<SidebarView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>(data.bookings);

  const venue = data.venues.find((v) => v.id === venueId)!;

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return bookings.filter((b) => {
      if (b.venue !== venueId) return false;
      if (hallId !== ALL_HALLS && b.hall !== hallId) return false;
      if (!query) return true;
      return b.event.toLowerCase().includes(query) || b.customer.toLowerCase().includes(query);
    });
  }, [bookings, venueId, hallId, searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [venueId, hallId]);

  const bookingsByDate = useMemo(() => groupBookingsByDate(filteredBookings), [filteredBookings]);

  const multiDayEvents = useMemo<RangeEvent[]>(
    () =>
      filteredBookings
        .filter((b) => b.startDate !== b.endDate)
        .map((b) => ({
          id: b.id,
          label: b.event,
          startDate: b.startDate,
          endDate: b.endDate,
          className: STATUS_BAR_STYLES[b.status],
        })),
    [filteredBookings]
  );

  function selectBooking(booking: Booking) {
    const siblings = bookingsByDate.get(booking.startDate) ?? [booking];
    setSidebarView({ type: "booking", booking, siblings });
  }

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

  function handleDropBooking(bookingId: string, dropDate: Date) {
    const newStartKey = formatDateKey(dropDate);

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId || b.startDate === newStartKey) return b;

        const start = new Date(`${b.startDate}T00:00:00`);
        const end = new Date(`${b.endDate}T00:00:00`);
        const durationDays = Math.round((end.getTime() - start.getTime()) / 86_400_000);

        const newStart = new Date(`${newStartKey}T00:00:00`);
        const newEnd = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate() + durationDays);

        return { ...b, startDate: newStartKey, endDate: formatDateKey(newEnd) };
      })
    );
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.company.name}</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <Header
        venueOptions={data.venues.map((v) => ({ label: v.name, value: v.id }))}
        venueId={venueId}
        onVenueChange={handleVenueChange}
        hallOptions={[
          { label: "All Halls", value: ALL_HALLS },
          ...venue.halls.map((h) => ({ label: h.name, value: h.id })),
        ]}
        hallId={hallId}
        onHallChange={setHallId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
      />

      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <MonthlyCalendar
          visibleMonth={visibleMonth}
          value={selectedDate}
          onChange={handleDateClick}
          onDropBooking={handleDropBooking}
          events={multiDayEvents}
          onSelectEvent={(event) => {
            const booking = filteredBookings.find((b) => b.id === event.id);
            if (booking) selectBooking(booking);
          }}
          renderDay={(date) => {
            const dayBookings = bookingsByDate.get(formatDateKey(date)) ?? [];
            const singleDayBookings = dayBookings.filter((b) => b.startDate === b.endDate);
            const hasBar = dayBookings.some((b) => b.startDate !== b.endDate);

            return (
              <EventList
                bookings={singleDayBookings}
                maxVisible={hasBar ? 0 : 1}
                onSelectBooking={(booking) => setSidebarView({ type: "booking", booking, siblings: dayBookings })}
                onShowMore={() => setSidebarView({ type: "day", date, bookings: dayBookings })}
              />
            );
          }}
        />
      )}

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
