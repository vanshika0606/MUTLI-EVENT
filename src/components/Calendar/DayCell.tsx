import type { ReactNode } from "react";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick?: (date: Date) => void;
  children?: ReactNode;
}

export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  onClick,
  children,
}: DayCellProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(date)}
      className={`flex min-h-20 flex-col items-start gap-1 rounded-md border p-1.5 text-left ${
        isSelected ? "border-blue-500 ring-2 ring-inset ring-blue-500" : "border-gray-200"
      } ${isCurrentMonth ? "bg-white" : "bg-gray-50 opacity-60"}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
          isToday ? "bg-blue-600 text-white" : "text-gray-700"
        }`}
      >
        {date.getDate()}
      </span>
      {children}
    </button>
  );
}
