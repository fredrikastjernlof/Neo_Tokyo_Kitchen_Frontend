import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AdminBooking {
  id: string;
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
export class AdminBookings {
  selectedDate = '';

  bookings = signal<AdminBooking[]>([
    {
      id: '1',
      name: 'Aiko Tanaka',
      email: 'aiko@example.com',
      phone: '0701234567',
      date: '2026-05-30',
      time: '19:00',
      guests: 4,
    },
    {
      id: '2',
      name: 'Kenji Sato',
      email: 'kenji@example.com',
      phone: '0707654321',
      date: '2026-05-30',
      time: '20:00',
      guests: 2,
    },
  ]);

  selectedBooking = signal<AdminBooking | null>(null);

  editableBooking: AdminBooking = {
    id: '',
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
  };

  // Save edited booking
  saveBookingChanges(): void {
    this.bookings.update((bookings) =>
      bookings.map((booking) =>
        booking.id === this.editableBooking.id
          ? { ...this.editableBooking }
          : booking
      )
    );

    this.closeBooking();
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