import type { BookingStatus } from "../../types/mockData";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-100 text-emerald-700",
  Tentative: "bg-amber-100 text-amber-700",
  Maintenance: "bg-gray-200 text-gray-700",
};

interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}
