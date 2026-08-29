import type { ReactNode } from "react";
import { useState } from "react";

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick?: (date: Date) => void;
  onDropBooking?: (bookingId: string, date: Date) => void;
  contentOffset?: number;
  minHeight?: number;
  children?: ReactNode;
}

export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  onClick,
  onDropBooking,
  contentOffset = 0,
  minHeight = 80,
  children,
}: DayCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(date)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(date);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const bookingId = e.dataTransfer.getData("text/plain");
        if (bookingId) onDropBooking?.(bookingId, date);
      }}
      style={{ minHeight }}
      className={`flex cursor-pointer flex-col items-start gap-1 rounded-md border p-1.5 text-left ${
        isSelected ? "border-blue-500 ring-2 ring-inset ring-blue-500" : "border-gray-200 dark:border-gray-700"
      } ${isCurrentMonth ? "bg-white dark:bg-gray-900" : "bg-gray-50 opacity-60 dark:bg-gray-800"} ${
        isDragOver ? "ring-2 ring-inset ring-blue-400 bg-blue-50 dark:bg-blue-950/40" : ""
      }`}
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
