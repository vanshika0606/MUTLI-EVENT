import type { ReactNode } from "react";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick?: (date: Date) => void;
  contentOffset?: number;
  children?: ReactNode;
}

export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  onClick,
  contentOffset = 0,
  children,
}: DayCellProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(date)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(date);
      }}
      className={`flex min-h-20 cursor-pointer flex-col items-start gap-1 rounded-md border p-1.5 text-left ${
        isSelected ? "border-blue-500 ring-2 ring-inset ring-blue-500" : "border-gray-200 dark:border-gray-700"
      } ${isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 opacity-60 dark:bg-gray-800"}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
          isToday ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {date.getDate()}
      </span>
      <div className="w-full" style={{ marginTop: contentOffset }}>
        {children}
      </div>
    </div>
  );
}
