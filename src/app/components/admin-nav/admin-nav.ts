import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import 'iconify-icon';

@Component({
  selector: 'app-admin-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-nav.html',
  styleUrl: './admin-nav.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminNav {
  // Handle logout and navigation
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Log out user and redirect to login page
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
