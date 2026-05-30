import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


// Import interfaces and service
import { MenuCategory, MenuItem, MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})

// Run code when the component initializes
export class Menu implements OnInit {

  // Store all categories from the API
  categories = signal<MenuCategory[]>([]);

  // Store all menu items from the API
  menuItems = signal<MenuItem[]>([]);

  // Store category image IDs that failed to load
  brokenCategoryImages = signal<string[]>([]);

  // Store which category accordion is currently open
  openCategoryId = signal<string | null>(null);


  // Inject the MenuService
  constructor(private menuService: MenuService) { }

  // Run when the component initializes
  ngOnInit(): void {

    // Fetch categories from the API
    this.menuService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Fel vid hämtning av kategorier:', error);
      },
    });

    // Fetch menu items from the API
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems.set(items);
      },
      error: (error) => {
        console.error('Fel vid hämtning av meny:', error);
      },
    });
  }

  // Open or close a category accordion
  toggleCategory(categoryId: string): void {
    this.openCategoryId.update((currentId) =>
      currentId === categoryId ? null : categoryId
    );
  }

  // Return only menu items that belong to a specific category
  getItemsByCategory(categoryId: string): MenuItem[] {

    return this.menuItems().filter((item) => {

      // Handle category if it is stored as a string ID
      if (typeof item.category === 'string') {
        return item.category === categoryId;
      }

      // Handle category if it is populated as an object
      return item.category._id === categoryId;
    });
  }

  // Return the full image URL for a category image
  getCategoryImageUrl(category: MenuCategory): string | null {

    // Return null if the category has no image
    if (!category.image?.path) {
      return null;
    }

    // Return full backend image URL
    return `https://neo-tokyo-kitchen-api.onrender.com${category.image.path}`;
  }

  // Mark a category image as broken
  markCategoryImageAsBroken(categoryId: string): void {
    this.brokenCategoryImages.update((ids) => [...ids, categoryId]);
  }

  // Check if a category image has failed to load
  isCategoryImageBroken(categoryId: string): boolean {
    return this.brokenCategoryImages().includes(categoryId);
  }

}