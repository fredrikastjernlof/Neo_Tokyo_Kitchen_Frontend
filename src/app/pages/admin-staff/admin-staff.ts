import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-staff',
  imports: [FormsModule],
  templateUrl: './admin-staff.html',
  styleUrl: './admin-staff.scss',
})
export class AdminStaff {
  // State for user management
  userErrorMessage = signal('');
  userValidationErrors = signal<string[]>([]);
  invalidUserFields = signal<string[]>([]);

  isSavingUser = signal(false);

  showUserCreatedModal = signal(false);
  createdUserName = signal('');

  // Editable user form state
  editableUser = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as 'staff' | 'admin',
  };

  // Constructor with AuthService injection
  constructor(private authService: AuthService) { }

  // Validation
  validateUser(): boolean {
    const errors: string[] = [];
    const invalidFields: string[] = [];

    const name = this.editableUser.name.trim();
    const email = this.editableUser.email.trim();
    const password = this.editableUser.password.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      errors.push('Namnet måste innehålla minst 2 tecken.');
      invalidFields.push('staff-name');
    }

    if (!emailPattern.test(email)) {
      errors.push('Ange en giltig e-postadress.');
      invalidFields.push('staff-email');
    }

    if (password.length < 8) {
      errors.push('Lösenordet måste innehålla minst 8 tecken.');
      invalidFields.push('staff-password');
    }

    if (
      this.editableUser.password !==
      this.editableUser.confirmPassword
    ) {
      errors.push('Lösenorden matchar inte.');
      invalidFields.push('staff-password');
      invalidFields.push('staff-confirm-password');
    }

    if (
      this.editableUser.role !== 'staff' &&
      this.editableUser.role !== 'admin'
    ) {
      errors.push('Du måste välja en giltig roll.');
      invalidFields.push('staff-role');
    }

    this.userValidationErrors.set(errors);
    this.invalidUserFields.set(invalidFields);

    return errors.length === 0;
  }

  // If a specific field is invalid
  isInvalidUserField(field: string): boolean {
    return this.invalidUserFields().includes(field);
  }

  // Create user action
  createUser(): void {

    if (!this.validateUser()) {
      return;
    }

    this.isSavingUser.set(true);
    this.userErrorMessage.set('');

    this.authService.registerUser(this.editableUser).subscribe({
      next: (user) => {

        this.editableUser = {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'staff',
        };

        this.userValidationErrors.set([]);
        this.invalidUserFields.set([]);

        this.createdUserName.set(user.name);
        this.showUserCreatedModal.set(true);
        this.isSavingUser.set(false);
      },
      error: (error) => {
        if (error.status === 403) {
          this.userErrorMessage.set(
            'Du har inte behörighet att lägga till personal.'
          );
        } else {
          this.userErrorMessage.set(
            'Användaren kunde inte skapas.'
          );
        }

        this.editableUser = {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'staff',
        };

        this.userValidationErrors.set([]);
        this.invalidUserFields.set([]);
        
        this.isSavingUser.set(false);
      },
    });
  }

}
