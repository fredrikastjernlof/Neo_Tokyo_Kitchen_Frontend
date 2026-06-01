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
  validationErrors = signal<string[]>([]);
  invalidFields = signal<string[]>([]);


  // Handle login form submission
  login(): void {

    this.errorMessage.set('');

    this.validationErrors.set([]);
    this.invalidFields.set([]);

    if (!this.validateLogin()) {
      return;
    }

    this.isLoading.set(true);

    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({

      next: (user) => {

        this.authService.saveUser(user);

        this.isLoading.set(false);

        this.router.navigate(['/admin/dashboard']);
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

  // Validate login form and set error messages and invalid fields
  private validateLogin(): boolean {

    const errors: string[] = [];
    const invalidFields: string[] = [];

    if (!this.email.trim()) {
      errors.push('E-post måste anges.');
      invalidFields.push('email');
    }

    if (!this.password.trim()) {
      errors.push('Lösenord måste anges.');
      invalidFields.push('password');
    }

    if (
      this.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    ) {
      errors.push('Ange en giltig e-postadress.');
      invalidFields.push('email');
    }

    this.validationErrors.set(errors);
    this.invalidFields.set(invalidFields);

    return errors.length === 0;
  }

  // Clear error for a specific field when the user starts typing
  clearFieldError(field: string): void {

    this.invalidFields.update(fields =>
      fields.filter(item => item !== field)
    );
  }

}