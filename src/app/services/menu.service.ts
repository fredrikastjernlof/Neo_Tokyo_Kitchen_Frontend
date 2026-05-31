import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
