import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



// Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  token: string;
}

export interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

// Service for handling authentication and user management
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl =
    'https://neo-tokyo-kitchen-api.onrender.com/api/auth';

  currentUser = signal<AuthUser | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  isLoggedIn = computed(() =>
    this.currentUser() !== null
  );

  isAdmin = computed(() =>
    this.currentUser()?.role === 'admin'
  );

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  saveUser(user: AuthUser): void {
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.currentUser()?.token || null;
  }

  registerUser(
    user: RegisterUserRequest
  ): Observable<AuthUser> {
    return this.http.post<AuthUser>(
      `${this.apiUrl}/register`,
      user,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
    );
  }

  // Create authorization headers for protected admin routes
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
  }

  // Get all registered users
  getUsers(): Observable<StaffUser[]> {
    return this.http.get<StaffUser[]>(
      `${this.apiUrl}/users`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Delete a user by id
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/users/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

}