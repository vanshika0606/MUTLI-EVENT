interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick?: (date: Date) => void;
}

export default function DayCell({ date, isCurrentMonth, isToday, isSelected, onClick }: DayCellProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(date)}
      className={`flex h-8 items-center justify-center rounded-md text-sm ${
        isSelected
          ? "bg-blue-600 text-white"
          : isToday
            ? "font-semibold text-blue-600 hover:bg-blue-50"
            : "text-gray-700 hover:bg-gray-100"
      } ${isCurrentMonth ? "" : "text-gray-300 hover:bg-transparent"}`}
    >
      {date.getDate()}
    </button>
  );
}
