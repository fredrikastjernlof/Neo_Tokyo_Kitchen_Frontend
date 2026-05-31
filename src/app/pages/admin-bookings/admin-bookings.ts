import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  BookingResponse,
  BookingService,
} from '../../services/booking.service';

interface AdminBooking {
  id: string;
  bookingNumber: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}

@Component({
  selector: 'app-admin-bookings',
  imports: [FormsModule],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.scss',
})
export class AdminBookings implements OnInit {
  selectedDate = '';

  bookings = signal<AdminBooking[]>([]);

  selectedBooking = signal<AdminBooking | null>(null);

  editableBooking: AdminBooking = {
    id: '',
    bookingNumber: '',
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
  };

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  // Load bookings from backend
  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings.set(
          bookings.map((booking) => this.mapBooking(booking))
        );
      },
      error: (error) => {
        console.error('Could not load bookings', error);
      },
    });
  }

  // Convert backend booking to admin booking
  private mapBooking(booking: BookingResponse): AdminBooking {
    return {
      id: booking._id,
      bookingNumber: booking.bookingNumber,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,

      // Keep original date and time from backend
      date: booking.startTime.slice(0, 10),
      time: booking.startTime.slice(11, 16),

      guests: booking.guests,
    };
  }

  // Save edited booking in backend
  saveBookingChanges(): void {
    const updatedBooking = {
      name: this.editableBooking.name,
      email: this.editableBooking.email,
      phone: this.editableBooking.phone,
      guests: this.editableBooking.guests,
      startTime: `${this.editableBooking.date}T${this.editableBooking.time}`,
    };

    this.bookingService.updateBooking(
      this.editableBooking.id,
      updatedBooking
    ).subscribe({
      next: (booking) => {
        const mappedBooking = this.mapBooking(booking);

        this.bookings.update((bookings) =>
          bookings.map((currentBooking) =>
            currentBooking.id === mappedBooking.id
              ? mappedBooking
              : currentBooking
          )
        );

        this.closeBooking();
      },
      error: (error) => {
        console.error('Could not update booking', error);
      },
    });
  }

  // Open booking overlay
  openBooking(booking: AdminBooking): void {
    this.selectedBooking.set(booking);
    this.editableBooking = { ...booking };
  }

  // Close booking overlay
  closeBooking(): void {
    this.selectedBooking.set(null);
  }
}