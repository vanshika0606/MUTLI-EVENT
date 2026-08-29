import type { Booking } from "../../types/mockData";
import StatusBadge from "../Common/StatusBadge";

interface BookingCardProps {
  booking: Booking;
  onClick?: (booking: Booking) => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(booking)}
      className="flex w-full flex-col gap-1 rounded-md border border-gray-200 p-3 text-left hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{booking.event}</span>
        <StatusBadge status={booking.status} />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {booking.startTime} – {booking.endTime}
      </span>
    </button>
  );
}
