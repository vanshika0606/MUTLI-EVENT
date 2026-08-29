import type { Booking } from "../../types/mockData";
import Sidebar from "../Common/Sidebar";
import BookingCard from "./BookingCard";
import BookingDetails from "./BookingDetails";

export type SidebarView =
  | { type: "day"; date: Date; bookings: Booking[] }
  | { type: "booking"; booking: Booking };

interface BookingSidebarProps {
  view: SidebarView | null;
  onClose: () => void;
  onSelectBooking: (booking: Booking) => void;
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

  return (
    <Sidebar isOpen={view !== null} onClose={onClose} title={title}>
      {view?.type === "booking" && (
        <BookingDetails
          booking={view.booking}
          venueName={getVenueName(view.booking.venue)}
          hallName={getHallName(view.booking.hall)}
        />
      )}
      {view?.type === "day" && (
        <div className="flex flex-col gap-2">
          {view.bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onClick={onSelectBooking} />
          ))}
        </div>
      )}
    </Sidebar>
  );
}
