import Dropdown, { type DropdownOption } from "../Common/Dropdown";
import MonthPicker from "../Common/MonthPicker";

interface HeaderProps {
  venueOptions: DropdownOption[];
  venueId: string;
  onVenueChange: (value: string) => void;
  hallOptions: DropdownOption[];
  hallId: string;
  onHallChange: (value: string) => void;
  visibleMonth: Date;
  onVisibleMonthChange: (date: Date) => void;
}

export default function Header({
  venueOptions,
  venueId,
  onVenueChange,
  hallOptions,
  hallId,
  onHallChange,
  visibleMonth,
  onVisibleMonthChange,
}: HeaderProps) {
  const monthLabel = visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const prevMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-56">
          <Dropdown options={venueOptions} value={venueId} onChange={onVenueChange} />
        </div>
        <div className="w-56">
          <Dropdown options={hallOptions} value={hallId} onChange={onHallChange} />
        </div>
        <button
          type="button"
          onClick={() => onVisibleMonthChange(new Date())}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onVisibleMonthChange(prevMonth)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Previous month"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => onVisibleMonthChange(nextMonth)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Next month"
        >
          ›
        </button>
        <h2 className="ml-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{monthLabel}</h2>
      </div>

      <MonthPicker value={visibleMonth} onChange={onVisibleMonthChange} />
    </div>
  );
}
