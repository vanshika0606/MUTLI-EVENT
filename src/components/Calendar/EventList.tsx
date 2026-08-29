import type { Booking } from "../../types/mockData";
import EventChip from "./EventChip";

interface EventListProps {
  bookings: Booking[];
  maxVisible?: number;
  onSelectBooking?: (booking: Booking) => void;
}

export default function EventList({ bookings, maxVisible = 2, onSelectBooking }: EventListProps) {
  const visible = bookings.slice(0, maxVisible);
  const hiddenCount = bookings.length - visible.length;

  return (
    <div className="flex w-full flex-col gap-0.5">
      {visible.map((booking) => (
        <EventChip key={booking.id} booking={booking} onClick={onSelectBooking} />
      ))}
      {hiddenCount > 0 && (
        <span className="px-0.5 text-[11px] font-medium text-gray-500">+{hiddenCount} more</span>
      )}
    </div>
  );
}
