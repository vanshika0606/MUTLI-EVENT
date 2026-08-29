import type { Booking } from "../../types/mockData";

const STATUS_DOT: Record<Booking["status"], string> = {
  Confirmed: "bg-emerald-500",
  Tentative: "bg-amber-500",
  Maintenance: "bg-gray-400",
};

interface EventChipProps {
  booking: Booking;
  onClick?: (booking: Booking) => void;
}

export default function EventChip({ booking, onClick }: EventChipProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(booking);
      }}
      className="flex w-full items-center gap-1 truncate rounded px-0.5 text-left text-[11px] text-gray-700 hover:bg-gray-100"
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[booking.status]}`} />
      <span className="truncate">{booking.event}</span>
    </button>
  );
}
