import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import 'iconify-icon';

@Component({
  selector: 'app-booking',
  imports: [FormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Booking {
  booking = {
    guests: 2,
    date: '',
    time: '20:00',
    name: '',
    email: '',
    phone: '',
  };
}
