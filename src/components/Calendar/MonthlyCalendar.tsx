import type { ReactNode } from "react";
import { WEEKDAY_LABELS, chunkIntoWeeks, getMonthGrid } from "../../utils/calendar";
import type { RangeEvent } from "../../utils/eventBars";
import WeekRow from "./WeekRow";

interface MonthlyCalendarProps {
  visibleMonth: Date;
  value?: Date;
  onChange?: (date: Date) => void;
  renderDay?: (date: Date) => ReactNode;
  events?: RangeEvent[];
  onSelectEvent?: (event: RangeEvent) => void;
}

export default function MonthlyCalendar({
  visibleMonth,
  value,
  onChange,
  renderDay,
  events,
  onSelectEvent,
}: MonthlyCalendarProps) {
  const today = new Date();
  const weeks = chunkIntoWeeks(getMonthGrid(visibleMonth));

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="grid grid-cols-7 bg-blue-950 dark:bg-blue-900">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-3 text-center text-sm font-semibold text-white">
            {label}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 p-4">
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
