import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'iconify-icon';


// Import interfaces and service
import { MenuService } from '../../services/menu.service';
import { MenuCategory, MenuItem } from '../../models/menu.model';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

        categories.forEach((category) => {
          this.checkCategoryImage(category);
        });
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
  getCategoryImageUrl(category: MenuCategory): string {
    const fallbackImages: Record<string, string> = {
      ramen: 'images/categories/ramen.webp',
      'rice-bowls': 'images/categories/rice-bowls.webp',
      izakaya: 'images/categories/izakaya.webp',
      desserts: 'images/categories/desserts.webp',
      drinks: 'images/categories/drinks.webp',
    };

    if (
      category.image?.path &&
      !this.isCategoryImageBroken(category._id)
    ) {
      return `https://neo-tokyo-kitchen-api.onrender.com${category.image.path}`;
    }

    return fallbackImages[category.slug] ?? 'images/categories/fallback.webp';
  }

  // Check if a category image can be loaded successfully
  checkCategoryImage(category: MenuCategory): void {
    if (!category.image?.path) {
      return;
    }

    const image = new Image();

    image.onerror = () => {
      this.markCategoryImageAsBroken(category._id);
    };

    image.src = `https://neo-tokyo-kitchen-api.onrender.com${category.image.path}`;
  }

  // Mark a category image as broken
  markCategoryImageAsBroken(categoryId: string): void {
    this.brokenCategoryImages.update((ids) => [...ids, categoryId]);
  }

  // Check if a category image has failed to load
  isCategoryImageBroken(categoryId: string): boolean {
    return this.brokenCategoryImages().includes(categoryId);
  }

  getProteinIcon(protein?: string): string {
    const icons: Record<string, string> = {
      beef: 'ph:cow',
      pork: 'lucide-lab:pig',
      chicken: 'fluent-emoji-high-contrast:chicken',
      duck: 'hugeicons:rubber-duck',
      tofu: 'lucide:sprout',
      salmon: 'majesticons:fish-line',
      shrimp: 'tdesign:shrimp',
      seafood: 'hugeicons:crab',
      none: '',
    };

    return icons[protein || 'none'] || '';
  }

  getSpiceIcons(spiceLevel?: number): number[] {
    return Array(spiceLevel || 0).fill(0);
  }

}