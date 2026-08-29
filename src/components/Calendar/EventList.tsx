import type { Booking } from "../../types/mockData";
import EventChip from "./EventChip";

interface EventListProps {
  bookings: Booking[];
  maxVisible?: number;
  onSelectBooking?: (booking: Booking, siblings: Booking[]) => void;
  onShowMore?: (bookings: Booking[]) => void;
}

export default function EventList({ bookings, maxVisible = 2, onSelectBooking, onShowMore }: EventListProps) {
  const visible = bookings.slice(0, maxVisible);
  const hiddenCount = bookings.length - visible.length;

  return (
    <div className="flex w-full flex-col gap-0.5">
      {visible.map((booking) => (
        <EventChip
          key={booking.id}
          booking={booking}
          onClick={(b) => onSelectBooking?.(b, bookings)}
        />
      ))}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShowMore?.(bookings);
          }}
          className="px-0.5 text-left text-[11px] font-medium text-gray-500 hover:text-gray-700 hover:underline"
        >
          +{hiddenCount} more
        </button>
      )}
    </div>
  );
}
