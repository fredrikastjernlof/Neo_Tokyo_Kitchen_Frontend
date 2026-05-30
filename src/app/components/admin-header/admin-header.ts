import { Component } from '@angular/core';

import { SiteLogo } from '../site-logo/site-logo';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [SiteLogo],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.scss',
})
export class AdminHeader {}