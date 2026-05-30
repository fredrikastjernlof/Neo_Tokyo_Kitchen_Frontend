import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  email = '';
  password = '';

  isLoading = signal(false);
  errorMessage = signal('');

  login(): void {

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({

      next: (user) => {

        this.authService.saveUser(user);

        this.isLoading.set(false);

        this.router.navigate(['/']);
      },

      error: (error) => {

        this.isLoading.set(false);

        this.errorMessage.set(
          error.error?.message ||
          'Fel användarnamn eller lösenord.'
        );
      },
    });
  }
}