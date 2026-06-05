import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { BookingResponse, AdminBooking } from '../../models/booking.model';
import 'iconify-icon';


@Component({
  selector: 'app-admin-bookings',
  imports: [FormsModule],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminBookings implements OnInit {

  selectedDate = '';
  searchTerm = '';

  // Computed booking values
  // Filter bookings by selected date and search term
  get filteredBookings(): AdminBooking[] {
    const search = this.searchTerm.toLowerCase().trim();

    return this.bookings().filter((booking) => {
      const matchesDate =
        !this.selectedDate || booking.date === this.selectedDate;

      const matchesSearch =
        !search ||
        booking.bookingNumber.toLowerCase().includes(search) ||
        booking.name.toLowerCase().includes(search) ||
        booking.email.toLowerCase().includes(search) ||
        booking.phone.toLowerCase().includes(search);

      return matchesDate && matchesSearch;
    });
  }

  get totalBookings(): number {
    return this.filteredBookings.length;
  }

  get totalGuests(): number {
    return this.filteredBookings.reduce(
      (total, booking) => total + booking.guests,
      0
    );
  }

  // Component state
  bookings = signal<AdminBooking[]>([]);
  selectedBooking = signal<AdminBooking | null>(null);
  showDeleteConfirmation = signal(false);
  validationErrors = signal<string[]>([]);
  invalidFields = signal<string[]>([]);
  isCreatingBooking = signal(false);

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

  // Load upcoming bookings
  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        const now = new Date();

        this.bookings.set(
          this.sortBookings(
            bookings
              .filter((booking) => new Date(booking.startTime) >= now)
              .map((booking) => this.mapBooking(booking))
          )
        );
      },
      error: (error) => {
        console.error('Could not load bookings', error);
      },
    });
  }

  // Sort bookings by date and time
  private sortBookings(bookings: AdminBooking[]): AdminBooking[] {
    return [...bookings].sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
    );
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
    if (!this.validateBooking()) {
      return;
    }

    if (this.isCreatingBooking()) {
      this.createAdminBooking();
      return;
    }

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
          this.sortBookings(
            bookings.map((currentBooking) =>
              currentBooking.id === mappedBooking.id
                ? mappedBooking
                : currentBooking
            )
          )
        );

        this.closeBooking();
      },
      error: (error) => {
        console.error('Could not update booking', error);
      },
    });
  }

  // Create new booking from admin
  createAdminBooking(): void {
    const newBooking = {
      name: this.editableBooking.name,
      email: this.editableBooking.email,
      phone: this.editableBooking.phone,
      guests: this.editableBooking.guests,
      startTime: `${this.editableBooking.date}T${this.editableBooking.time}`,
    };

    this.bookingService.createBooking(newBooking).subscribe({
      next: (booking) => {
        this.bookings.update((bookings) =>
          this.sortBookings([
            this.mapBooking(booking),
            ...bookings,
          ])
        );

        this.closeBooking();
      },
      error: (error) => {
        console.error('Could not create booking', error);
      },
    });
  }

   // Delete booking
  deleteBooking(): void {
    this.bookingService.deleteBooking(
      this.editableBooking.id
    ).subscribe({
      next: () => {
        this.bookings.update((bookings) =>
          bookings.filter(
            (booking) =>
              booking.id !== this.editableBooking.id
          )
        );

        this.showDeleteConfirmation.set(false);
        this.closeBooking();
      },
      error: (error) => {
        console.error(
          'Could not delete booking',
          error
        );
      },
    });
  }

  // Open overlay for new booking
  openNewBooking(): void {
    this.showDeleteConfirmation.set(false);
    this.isCreatingBooking.set(true);

    this.editableBooking = {
      id: '',
      bookingNumber: '',
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '19:00',
      guests: 2,
    };

    this.selectedBooking.set(this.editableBooking);
  }
  
  // Open booking overlay
  openBooking(booking: AdminBooking): void {
    this.showDeleteConfirmation.set(false);
    this.isCreatingBooking.set(false);

    this.selectedBooking.set(booking);
    this.editableBooking = { ...booking };
  }

  // Close booking overlay
  closeBooking(): void {
    this.showDeleteConfirmation.set(false);
    this.isCreatingBooking.set(false);
    this.selectedBooking.set(null);
  }

  // Open delete confirmation
  openDeleteConfirmation(): void {
    this.showDeleteConfirmation.set(true);
  }

  // Close delete confirmation
  closeDeleteConfirmation(): void {
    this.showDeleteConfirmation.set(false);
  }

  // Check if field has validation error
  isInvalid(field: string): boolean {
    return this.invalidFields().includes(field);
  }

  // Validate booking details before updating backend
  validateBooking(): boolean {
    const errors: string[] = [];

    const name = this.editableBooking.name.trim();
    const email = this.editableBooking.email.trim();
    const phone = this.editableBooking.phone.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+0-9\s-]{7,20}$/;

    const invalidFields: string[] = [];

    if (this.editableBooking.guests < 1 || this.editableBooking.guests > 12) {
      errors.push('Antal gäster måste vara mellan 1 och 12.');
      invalidFields.push('guests');
    }

    if (!this.editableBooking.date) {
      errors.push('Du måste välja ett datum.');
      invalidFields.push('date');
    } else {
      const selectedDate = new Date(this.editableBooking.date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push('Datumet kan inte vara bakåt i tiden.');
        invalidFields.push('date');
      }
    }

    if (!this.editableBooking.time) {
      errors.push('Du måste välja en tid.');
      invalidFields.push('time');
    } else if (
      this.editableBooking.time < '11:00' ||
      this.editableBooking.time > '21:00'
    ) {
      errors.push('Bordsbokning är möjlig mellan kl. 11:00 och 21:00.');
      invalidFields.push('time');
    }

    if (name.length < 2) {
      errors.push('Namnet måste innehålla minst 2 tecken.');
      invalidFields.push('name');
    }

    if (!emailPattern.test(email)) {
      errors.push('Ange en giltig e-postadress.');
      invalidFields.push('email');
    }

    if (!phonePattern.test(phone)) {
      errors.push('Ange ett giltigt telefonnummer.');
      invalidFields.push('phone');
    }

    this.validationErrors.set(errors);
    this.invalidFields.set(invalidFields);

    return errors.length === 0;
  }

}