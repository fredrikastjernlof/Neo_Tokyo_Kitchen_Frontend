import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  token: string;
}

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

  constructor(private http: HttpClient) {}

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
}