import type { ReactNode } from "react";
import { isSameDay } from "../../utils/calendar";
import { layoutWeekBars, type RangeEvent } from "../../utils/eventBars";
import DayCell from "./DayCell";
import EventBar from "./EventBar";

const LANE_HEIGHT = 20;
const BAR_AREA_TOP = 32;

interface WeekRowProps {
  week: Date[];
  monthDate: Date;
  today: Date;
  value?: Date;
  onSelectDate?: (date: Date) => void;
  renderDay?: (date: Date) => ReactNode;
  events?: RangeEvent[];
  onSelectEvent?: (event: RangeEvent) => void;
}

export default function WeekRow({
  week,
  monthDate,
  today,
  value,
  onSelectDate,
  renderDay,
  events = [],
  onSelectEvent,
}: WeekRowProps) {
  const bars = layoutWeekBars(week, events);
  const laneCount = bars.reduce((max, bar) => Math.max(max, bar.lane + 1), 0);

  return (
    <div className="relative">
      <div className="grid grid-cols-7 gap-px">
        {week.map((date) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            isCurrentMonth={date.getMonth() === monthDate.getMonth()}
            isToday={isSameDay(date, today)}
            isSelected={value ? isSameDay(date, value) : false}
            onClick={onSelectDate}
            contentOffset={laneCount * LANE_HEIGHT}
          >
            {renderDay?.(date)}
          </DayCell>
        ))}
      </div>

      {laneCount > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0 grid grid-cols-7 gap-px px-px"
          style={{ top: BAR_AREA_TOP, rowGap: 2 }}
        >
          {bars.map(({ event, startCol, endCol, lane, continuesBefore, continuesAfter }) => (
            <div
              key={event.id}
              className="pointer-events-auto"
              style={{ gridColumn: `${startCol + 1} / ${endCol + 2}`, gridRow: lane + 1 }}
            >
              <EventBar
                label={event.label}
                className={event.className}
                roundedLeft={!continuesBefore}
                roundedRight={!continuesAfter}
                onClick={() => onSelectEvent?.(event)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
