// Interfaces

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  guests: number;
  startTime: string;
  notes?: string;
}

export interface BookingResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  startTime: string;
  bookingNumber: string;
  status: string;
  notes?: string;
}

export interface AdminBooking {
  id: string;
  bookingNumber: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}