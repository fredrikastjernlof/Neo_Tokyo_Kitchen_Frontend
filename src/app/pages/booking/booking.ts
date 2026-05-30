import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingResponse, BookingService } from '../../services/booking.service';
import 'iconify-icon';

@Component({
  selector: 'app-booking',
  imports: [FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Booking {

  constructor(
    private bookingService: BookingService,
  ) { }

  booking = {
    guests: 2,
    date: '',
    time: '20:00',
    name: '',
    email: '',
    phone: '',
  };

  // Track loading state while booking is being sent
  isLoading = signal(false);

  // Store confirmed booking details after successful booking
  confirmedBooking = signal<BookingResponse | null>(null);

  // Store error message
  errorMessage = signal('');

  // Send booking to backend
  submitBooking(): void {

    // Reset messages
    this.errorMessage.set('');

    // Clear previous booking details
    this.confirmedBooking.set(null);

    // Show loading state
    this.isLoading.set(true);

    // Combine date and time into one datetime string
    const startTime =
      `${this.booking.date}T${this.booking.time}`;

    // Send booking request

    this.bookingService.createBooking({

      name: this.booking.name,
      email: this.booking.email,
      phone: this.booking.phone,

      guests: this.booking.guests,

      startTime,

    }).subscribe({

      // Booking created successfully
      next: (booking) => {
        this.isLoading.set(false);
        this.confirmedBooking.set(booking);
      },

      // Something went wrong
      error: (error) => {

        console.error('Fel vid bokning:', error);

        this.isLoading.set(false);

        this.errorMessage.set(
          error.error?.message || 'Något gick fel. Försök igen senare.'
        );
      },
    });
  }

  closeConfirmation(): void {

    this.confirmedBooking.set(null);

    this.booking = {
      guests: 2,
      date: '',
      time: '20:00',
      name: '',
      email: '',
      phone: '',
    };
  }
}
