import type { ReactNode } from "react";
import { isSameDay } from "../../utils/calendar";
import { layoutWeekBars, type RangeEvent } from "../../utils/eventBars";
import DayCell from "./DayCell";
import EventBar from "./EventBar";

const LANE_HEIGHT = 20;
const BAR_AREA_TOP = 32;
const MAX_BAR_LANES = 2;

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
  const visibleBars = bars.filter((bar) => bar.lane < MAX_BAR_LANES);
  const hiddenBars = bars.filter((bar) => bar.lane >= MAX_BAR_LANES);
  const laneCount = Math.min(MAX_BAR_LANES, bars.reduce((max, bar) => Math.max(max, bar.lane + 1), 0));
  const overflowRow = hiddenBars.length > 0 ? laneCount + 1 : 0;
  const reservedLanes = laneCount + (overflowRow > 0 ? 1 : 0);

  const hiddenCountByCol = week.map(
    (_, col) => hiddenBars.filter((bar) => bar.startCol <= col && bar.endCol >= col).length
  );

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
            contentOffset={reservedLanes * LANE_HEIGHT}
          >
            {renderDay?.(date)}
          </DayCell>
        ))}
      </div>

      {reservedLanes > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0 grid grid-cols-7 gap-px px-px"
          style={{ top: BAR_AREA_TOP, rowGap: 2 }}
        >
          {visibleBars.map(({ event, startCol, endCol, lane, continuesBefore, continuesAfter }) => (
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

          {overflowRow > 0 &&
            hiddenCountByCol.map(
              (count, col) =>
                count > 0 && (
                  <div
                    key={`overflow-${col}`}
                    className="pointer-events-auto"
                    style={{ gridColumn: `${col + 1} / ${col + 2}`, gridRow: overflowRow }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDate?.(week[col]);
                      }}
                      className="px-1.5 text-left text-[11px] font-medium text-gray-500 hover:text-gray-700 hover:underline"
                    >
                      +{count} more
                    </button>
                  </div>
                )
            )}
        </div>
      )}
    </div>
  );
}
