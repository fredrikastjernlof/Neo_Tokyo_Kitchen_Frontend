import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  // Backend API URL
  private apiUrl = 'https://neo-tokyo-kitchen-api.onrender.com/api';

  constructor(private http: HttpClient) {}

  // Send booking to the backend API
  createBooking(
    booking: BookingRequest
  ): Observable<BookingResponse> {

    return this.http.post<BookingResponse>(
      `${this.apiUrl}/bookings`,
      booking
    );
  }
}