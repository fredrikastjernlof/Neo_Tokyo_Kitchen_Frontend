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
