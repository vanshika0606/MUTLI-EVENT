import { formatDateKey } from "./calendar";

export interface RangeEvent {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  className?: string;
}

export interface PositionedBar {
  event: RangeEvent;
  startCol: number;
  endCol: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

/** Positions events that overlap a 7-day week into non-overlapping lanes, spanning start/end columns. */
export function layoutWeekBars(week: Date[], events: RangeEvent[]): PositionedBar[] {
  const weekStartKey = formatDateKey(week[0]);
  const weekEndKey = formatDateKey(week[week.length - 1]);

  const overlapping = events
    .filter((event) => event.startDate <= weekEndKey && event.endDate >= weekStartKey)
    .map((event) => {
      const continuesBefore = event.startDate < weekStartKey;
      const continuesAfter = event.endDate > weekEndKey;
      const startCol = continuesBefore ? 0 : week.findIndex((d) => formatDateKey(d) === event.startDate);
      const endCol = continuesAfter ? week.length - 1 : week.findIndex((d) => formatDateKey(d) === event.endDate);
      return { event, startCol, endCol, continuesBefore, continuesAfter };
    })
    .sort((a, b) => a.startCol - b.startCol || b.endCol - a.endCol);

  const laneEndCols: number[] = [];
  const positioned: PositionedBar[] = [];

  for (const item of overlapping) {
    let lane = laneEndCols.findIndex((endCol) => endCol < item.startCol);
    if (lane === -1) {
      lane = laneEndCols.length;
    }
    laneEndCols[lane] = item.endCol;
    positioned.push({ ...item, lane });
  }

  return positioned;
}
