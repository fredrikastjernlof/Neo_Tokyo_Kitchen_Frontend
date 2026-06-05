import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MenuCategory, MenuItem } from '../models/menu.model';


@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = 'https://neo-tokyo-kitchen-api.onrender.com/api';
  private imageBaseUrl = 'https://neo-tokyo-kitchen-api.onrender.com';
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Create auth headers for protected routes
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }


  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(`${this.apiUrl}/categories`);
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu-items`);
  }

  // Create menu item
  createMenuItem(menuItem: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.post<MenuItem>(
      `${this.apiUrl}/menu-items`,
      menuItem,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Update menu item
  updateMenuItem(
    id: string,
    menuItem: Partial<MenuItem>
  ): Observable<MenuItem> {
    return this.http.put<MenuItem>(
      `${this.apiUrl}/menu-items/${id}`,
      menuItem,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Delete menu item
  deleteMenuItem(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/menu-items/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Create category
  createCategory(category: {
    name: string;
    description?: string;
  }): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(
      `${this.apiUrl}/categories`,
      category,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Update category
  updateCategory(
    id: string,
    category: {
      name: string;
      description?: string;
    }
  ): Observable<MenuCategory> {
    return this.http.put<MenuCategory>(
      `${this.apiUrl}/categories/${id}`,
      category,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Delete category
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/categories/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Get full image URL for category
  getCategoryImageUrl(imagePath?: string): string | null {
    if (!imagePath) {
      return null;
    }

    return `${this.imageBaseUrl}${imagePath}`;
  }

  // Upload category image
  uploadCategoryImage(
    categoryId: string,
    imageFile: File,
    altText: string
  ): Observable<MenuCategory> {
    const formData = new FormData();

    formData.append('image', imageFile);
    formData.append('altText', altText);

    return this.http.post<MenuCategory>(
      `${this.apiUrl}/categories/${categoryId}/image`,
      formData,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

}
