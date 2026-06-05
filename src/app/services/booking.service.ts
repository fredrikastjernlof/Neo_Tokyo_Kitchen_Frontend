import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

import { BookingRequest, BookingResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  // Backend API URL
  private apiUrl = 'https://neo-tokyo-kitchen-api.onrender.com/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Create auth headers for protected routes
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  // Send booking to the backend API
  createBooking(
    booking: BookingRequest
  ): Observable<BookingResponse> {

    return this.http.post<BookingResponse>(
      `${this.apiUrl}/bookings`,
      booking
    );
  }

  // Get all bookings from backend
  getBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(
      `${this.apiUrl}/bookings`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Update booking
  updateBooking(
    id: string,
    booking: BookingRequest
  ): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(
      `${this.apiUrl}/bookings/${id}`,
      booking,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Delete booking
  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/bookings/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
  
}