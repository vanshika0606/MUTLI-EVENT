import type { Booking } from "../types/mockData";
import { formatDateKey } from "./calendar";

function getDateKeysInRange(startDate: string, endDate: string): string[] {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const keys: string[] = [];

  for (let d = start; d <= end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    keys.push(formatDateKey(d));
  }
  return keys;
}

/** Groups bookings by every date key they span, for quick lookup in a calendar day cell. */
export function groupBookingsByDate(bookings: Booking[]): Map<string, Booking[]> {
  const byDate = new Map<string, Booking[]>();

  for (const booking of bookings) {
    for (const dateKey of getDateKeysInRange(booking.startDate, booking.endDate)) {
      const existing = byDate.get(dateKey) ?? [];
      existing.push(booking);
      byDate.set(dateKey, existing);
    }
  }
  return byDate;
}
