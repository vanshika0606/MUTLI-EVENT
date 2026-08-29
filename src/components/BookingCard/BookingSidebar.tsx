import type { Booking } from "../../types/mockData";
import Sidebar from "../Common/Sidebar";
import BookingCard from "./BookingCard";
import BookingDetails from "./BookingDetails";

export type SidebarView =
  | { type: "day"; date: Date; bookings: Booking[] }
  | { type: "booking"; booking: Booking; siblings: Booking[] };

interface BookingSidebarProps {
  view: SidebarView | null;
  onClose: () => void;
  onSelectBooking: (booking: Booking, siblings: Booking[]) => void;
  getVenueName: (id: string) => string;
  getHallName: (id: string) => string;
}

export default function BookingSidebar({
  view,
  onClose,
  onSelectBooking,
  getVenueName,
  getHallName,
}: BookingSidebarProps) {
  const title =
    view?.type === "booking"
      ? "Booking Details"
      : view?.type === "day"
        ? view.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : undefined;

  const otherBookings =
    view?.type === "booking" ? view.siblings.filter((b) => b.id !== view.booking.id) : [];

  return (
    <Sidebar isOpen={view !== null} onClose={onClose} title={title}>
      {view?.type === "booking" && (
        <div className="flex flex-col gap-4">
          <BookingDetails
            booking={view.booking}
            venueName={getVenueName(view.booking.venue)}
            hallName={getHallName(view.booking.hall)}
          />
          {otherBookings.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Other events this day
              </h4>
              <div className="flex flex-col gap-2">
                {otherBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onClick={(b) => onSelectBooking(b, view.siblings)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {view?.type === "day" && (
        <div className="flex flex-col gap-2">
          {view.bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onClick={(b) => onSelectBooking(b, view.bookings)}
            />
          ))}
        </div>
      )}
    </Sidebar>
  );
}
