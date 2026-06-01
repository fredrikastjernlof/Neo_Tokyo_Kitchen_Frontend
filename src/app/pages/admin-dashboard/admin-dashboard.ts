import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterLink } from '@angular/router';
import 'iconify-icon';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminDashboard {}