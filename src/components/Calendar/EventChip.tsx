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
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", booking.id);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(booking);
      }}
      className="flex w-full cursor-grab items-center gap-1 truncate rounded px-0.5 text-left text-[11px] text-gray-700 hover:bg-gray-100 active:cursor-grabbing dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[booking.status]}`} />
      <span className="truncate">{booking.event}</span>
    </button>
  );
}
