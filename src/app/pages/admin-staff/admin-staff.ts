import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StaffUser } from '../../models/auth.model';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-admin-staff',
  imports: [FormsModule, ConfirmModal],
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

  // User list state
  users = signal<StaffUser[]>([]);

  // Selected user for deletion
  selectedUserToDelete = signal<StaffUser | null>(null);

  // Modal state
  showUsersModal = signal(false);
  showDeleteUserConfirmation = signal(false);

  // Loading states
  isLoadingUsers = signal(false);
  isDeletingUser = signal(false);

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

  // Load all users from backend
  loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.userErrorMessage.set('');

    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.showUsersModal.set(true);
        this.isLoadingUsers.set(false);
      },
      error: (error) => {

        if (error.status === 403) {
          this.userErrorMessage.set(
            'Du har inte behörighet att visa personal.'
          );
        } else {
          this.userErrorMessage.set(
            'Användarna kunde inte hämtas.'
          );
        }

        this.isLoadingUsers.set(false);
      },
    });
  }

  // Close user list modal
  closeUsersModal(): void {
    this.showUsersModal.set(false);
    this.showDeleteUserConfirmation.set(false);
    this.selectedUserToDelete.set(null);
  }

  // Open delete confirmation modal
  openDeleteUserConfirmation(
    user: StaffUser
  ): void {
    this.selectedUserToDelete.set(user);
    this.showDeleteUserConfirmation.set(true);
  }

  // Close delete confirmation modal
  closeDeleteUserConfirmation(): void {
    this.showDeleteUserConfirmation.set(false);
    this.selectedUserToDelete.set(null);
  }

  // Delete selected user
  deleteUser(): void {

    const user = this.selectedUserToDelete();

    if (!user) {
      return;
    }

    this.isDeletingUser.set(true);

    this.authService.deleteUser(user._id).subscribe({
      next: () => {

        // Remove deleted user from UI list
        this.users.update((users) =>
          users.filter(
            (currentUser) =>
              currentUser._id !== user._id
          )
        );

        this.showDeleteUserConfirmation.set(false);
        this.selectedUserToDelete.set(null);
        this.isDeletingUser.set(false);
      },

      error: (error) => {

        if (error.status === 403) {
          this.userErrorMessage.set(
            'Du har inte behörighet att ta bort personal.'
          );
        } else {
          this.userErrorMessage.set(
            'Användaren kunde inte tas bort.'
          );
        }

        this.isDeletingUser.set(false);
      },
    });
  }

}
