import type { Booking } from "../../types/mockData";
import DetailRow from "../Common/DetailRow";
import StatusBadge from "../Common/StatusBadge";

interface BookingDetailsProps {
  booking: Booking;
  venueName: string;
  hallName: string;
}

export default function BookingDetails({ booking, venueName, hallName }: BookingDetailsProps) {
  return (
    <div>
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{booking.event}</h3>
        <StatusBadge status={booking.status} />
      </div>

      <div className="flex flex-col">
        <DetailRow label="Venue" value={venueName} />
        <DetailRow label="Hall" value={hallName} />
        <DetailRow label="Customer Name" value={booking.customer} />
        <DetailRow label="Booking Status" value={booking.status} />
        <DetailRow label="Guest Count" value={booking.guests} />
        <DetailRow label="Start Date" value={booking.startDate} />
        <DetailRow label="Start Time" value={booking.startTime} />
        <DetailRow label="End Date" value={booking.endDate} />
        <DetailRow label="End Time" value={booking.endTime} />
      </div>
    </div>
  );
}
