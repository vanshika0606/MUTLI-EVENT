export interface Company {
  id: string;
  name: string;
}

export interface Hall {
  id: string;
  name: string;
  venueId: string;
  capacity: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  companyId: string;
  halls: Hall[];
}

export type BookingStatus = "Confirmed" | "Tentative" | "Maintenance";

export interface Booking {
  id: string;
  customer: string;
  event: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  hall: string;
  status: BookingStatus;
  guests: number;
}

export type DayAvailabilityStatus =
  | "Available"
  | "Partially Booked"
  | "Fully Booked"
  | "Maintenance";

export interface MockData {
  company: Company;
  venues: Venue[];
  bookings: Booking[];
}
