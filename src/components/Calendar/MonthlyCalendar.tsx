import type { ReactNode } from "react";
import { useState } from "react";
import { WEEKDAY_LABELS, chunkIntoWeeks, getMonthGrid } from "../../utils/calendar";
import type { RangeEvent } from "../../utils/eventBars";
import WeekRow from "./WeekRow";

interface MonthlyCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  renderDay?: (date: Date) => ReactNode;
  events?: RangeEvent[];
  onSelectEvent?: (event: RangeEvent) => void;
}

export default function MonthlyCalendar({
  value,
  onChange,
  renderDay,
  events,
  onSelectEvent,
}: MonthlyCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => value ?? new Date());
  const today = new Date();

  const weeks = chunkIntoWeeks(getMonthGrid(visibleMonth));
  const monthLabel = visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
            className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setVisibleMonth(new Date())}
            className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
            className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1 text-center text-xs font-medium text-gray-400">
            {label}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {weeks.map((week) => (
          <WeekRow
            key={week[0].toISOString()}
            week={week}
            monthDate={visibleMonth}
            today={today}
            value={value}
            onSelectDate={onChange}
            renderDay={renderDay}
            events={events}
            onSelectEvent={onSelectEvent}
          />
        ))}
      </div>
    </div>
  );
}
