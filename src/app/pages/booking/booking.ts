import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { BookingResponse } from '../../models/booking.model';
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

  weekDays = ['mån', 'tis', 'ons', 'tor', 'fre', 'lör', 'sön'];
  calendarMonth = new Date();

  // Track loading state while booking is being sent
  isLoading = signal(false);

  // Store confirmed booking details after successful booking
  confirmedBooking = signal<BookingResponse | null>(null);

  // Store error message
  errorMessage = signal('');

  // Store validation errors
  validationErrors = signal<string[]>([]);

  // Store list of fields that failed validation (for highlighting in UI)
  invalidFields = signal<string[]>([]);


  // Validate booking details before sending to backend
  validateBooking(): boolean {
    const errors: string[] = [];

    const name = this.booking.name.trim();
    const email = this.booking.email.trim();
    const phone = this.booking.phone.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+0-9\s-]{7,20}$/;

    const invalidFields: string[] = [];

    if (this.booking.guests < 1 || this.booking.guests > 12) {
      errors.push('Antal gäster måste vara mellan 1 och 12.');
      invalidFields.push('guests');
    }

    if (!this.booking.date) {
      errors.push('Du måste välja ett datum.');
      invalidFields.push('date');
    } else {
      const selectedDate = new Date(this.booking.date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push('Datumet kan inte vara bakåt i tiden.');
        invalidFields.push('date');
      }
    }

    if (!this.booking.time) {
      errors.push('Du måste välja en tid.');
      invalidFields.push('time');
    }

    else if (this.booking.time < '11:00' || this.booking.time > '21:00') {
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

  // Check if a specific field is invalid
  isInvalid(field: string): boolean {
    return this.invalidFields().includes(field);
  }

  // Clear validation error for a specific field when user starts correcting it
  clearFieldError(field: string): void {
    this.invalidFields.update((fields) =>
      fields.filter((currentField) => currentField !== field)
    );
  }

  // Increase or decrease number of guests, but keep it between 1 and 12
  increaseGuests(): void {
    if (this.booking.guests < 12) {
      this.booking.guests++;
      this.clearFieldError('guests');
    }
  }

  // Decrease number of guests, but not below 1
  decreaseGuests(): void {
    if (this.booking.guests > 1) {
      this.booking.guests--;
      this.clearFieldError('guests');
    }
  }

  // Format date as YYYY-MM-DD for input value
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Generate an array of dates for the current calendar month
  getCalendarDays(): (Date | null)[] {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startOffset = (firstDay.getDay() + 6) % 7;
    const days: (Date | null)[] = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  // Handle date selection, but ignore past dates
  selectDate(date: Date): void {
    if (this.isPastDate(date)) {
      return;
    }

    this.booking.date = this.formatDate(date);
    this.clearFieldError('date');
  }

  // Check if a date is the currently selected booking date
  isSelectedDate(date: Date): boolean {
    return this.booking.date === this.formatDate(date);
  }

  // Check if a date is in the past
  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate < today;
  }

  // Get label for current calendar month
  getCalendarMonthLabel(): string {
    return this.calendarMonth.toLocaleDateString('sv-SE', {
      month: 'long',
      year: 'numeric',
    });
  }

  // Navigate to previous or next month in calendar
  previousMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() - 1,
      1
    );
  }

  // Navigate to next month in calendar
  nextMonth(): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + 1,
      1
    );
  }

  // Check if a date falls on a weekend
  isWeekend(date: Date): boolean {
    const day = date.getDay();

    return day === 0 || day === 6;
  }

  // Increase or decrease time by 30 minutes, but keep it between 11:00 and 21:00
  increaseTime(): void {

    const [hours, minutes] =
      this.booking.time.split(':').map(Number);

    let totalMinutes =
      hours * 60 + minutes + 30;

    if (totalMinutes > 21 * 60) {
      totalMinutes = 21 * 60;
    }

    const newHours =
      Math.floor(totalMinutes / 60);

    const newMinutes =
      totalMinutes % 60;

    this.booking.time =
      `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;

    this.clearFieldError('time');
  }

  // Decrease time by 30 minutes, but not before 11:00
  decreaseTime(): void {

    const [hours, minutes] =
      this.booking.time.split(':').map(Number);

    let totalMinutes =
      hours * 60 + minutes - 30;

    if (totalMinutes < 11 * 60) {
      totalMinutes = 11 * 60;
    }

    const newHours =
      Math.floor(totalMinutes / 60);

    const newMinutes =
      totalMinutes % 60;

    this.booking.time =
      `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;

    this.clearFieldError('time');
  }

  // Send booking to backend
  submitBooking(): void {

    // Reset messages
    this.errorMessage.set('');
    this.validationErrors.set([]);

    // Validate booking details before sending
    if (!this.validateBooking()) {
      return;
    }

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
