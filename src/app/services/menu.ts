import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    filename: string;
    path: string;
    altText?: string;
  };
  sortOrder?: number;
  isActive: boolean;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: MenuCategory | string;
  price: number;
  dietary?: string[];
  protein?: string;
  spiceLevel?: number;
  tags?: string[];
  isAvailable: boolean;
  sortOrder?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = 'https://neo-tokyo-kitchen-api.onrender.com/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`);
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu-items`);
  }

}
