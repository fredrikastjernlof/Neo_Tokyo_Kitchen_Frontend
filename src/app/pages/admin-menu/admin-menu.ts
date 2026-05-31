import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import 'iconify-icon';

import {
  MenuCategory,
  MenuItem,
  MenuService,
} from '../../services/menu.service';

interface EditableCategory {
  id: string;
  name: string;
  description: string;

  image?: {
    filename: string;
    path: string;
    altText?: string;
  };
}

interface EditableMenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  protein: string;
  spiceLevel: number;
  isAvailable: boolean;
}

@Component({
  selector: 'app-admin-menu',
  imports: [FormsModule],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminMenu implements OnInit {

  // Category state
  categories = signal<MenuCategory[]>([]);
  selectedCategory = signal<EditableCategory | null>(null);
  isCreatingCategory = signal(false);
  isSavingCategory = signal(false);
  categoryErrorMessage = signal('');
  categoryToDelete = signal<EditableCategory | null>(null);
  showDeleteConfirmation = signal(false);
  isDeletingCategory = signal(false);
  categoryValidationErrors = signal<string[]>([]);

  // Menu item state
  menuItems = signal<MenuItem[]>([]);
  selectedMenuCategory = signal<MenuCategory | null>(null);
  selectedMenuItem = signal<EditableMenuItem | null>(null);
  isCreatingMenuItem = signal(false);
  isSavingMenuItem = signal(false);
  menuItemErrorMessage = signal('');
  menuItemValidationErrors = signal<string[]>([]);
  invalidMenuItemFields = signal<string[]>([]);
  showMenuItemDeleteConfirmation = signal(false);
  isDeletingMenuItem = signal(false);
  menuItemToDelete = signal<EditableMenuItem | null>(null);

  // Image upload state
  selectedImageFile: File | null = null;
  imagePreviewUrl = signal<string | null>(null);


  // Editable category object 
  editableCategory: EditableCategory = {
    id: '',
    name: '',
    description: '',
  };

  // Editable menu item object
  editableMenuItem: EditableMenuItem = {
    id: '',
    name: '',
    description: '',
    category: '',
    price: 0,
    protein: 'none',
    spiceLevel: 0,
    isAvailable: true,
  };

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadMenuItems();
  }

  // Load menu categories
  loadCategories(): void {
    this.menuService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Could not load categories', error);
      },
    });
  }

  // Load menu items
  loadMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (menuItems) => {
        this.menuItems.set(menuItems);
      },
      error: (error) => {
        console.error('Could not load menu items', error);
      },
    });
  }

  // Get icon name for protein type
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

  // Open/close menu item management for one category
  openMenuItemsForCategory(category: MenuCategory): void {

    const currentCategory =
      this.selectedMenuCategory();

    if (
      currentCategory?._id === category._id
    ) {
      this.closeMenuItemsForCategory();
      return;
    }

    this.selectedMenuCategory.set(category);
    this.selectedMenuItem.set(null);
  }

  // Close menu item management
  closeMenuItemsForCategory(): void {
    this.selectedMenuCategory.set(null);
    this.selectedMenuItem.set(null);
  }

  // Return menu items for selected category
  getMenuItemsForSelectedCategory(): MenuItem[] {
    const category = this.selectedMenuCategory();

    if (!category) {
      return [];
    }

    return this.menuItems().filter((item) => {
      if (typeof item.category === 'string') {
        return item.category === category._id;
      }

      return item.category._id === category._id;
    });
  }

  // Open overlay for new menu item
  openNewMenuItem(): void {
    const category = this.selectedMenuCategory();

    if (!category) {
      return;
    }

    this.isCreatingMenuItem.set(true);
    this.menuItemValidationErrors.set([]);
    this.menuItemErrorMessage.set('');

    this.editableMenuItem = {
      id: '',
      name: '',
      description: '',
      category: category._id,
      price: 0,
      protein: 'none',
      spiceLevel: 0,
      isAvailable: true,
    };

    this.selectedMenuItem.set(this.editableMenuItem);
  }

  // Open overlay for existing menu item
  openMenuItem(menuItem: MenuItem): void {
    this.isCreatingMenuItem.set(false);
    this.menuItemValidationErrors.set([]);
    this.menuItemErrorMessage.set('');

    this.editableMenuItem = {
      id: menuItem._id,
      name: menuItem.name,
      description: menuItem.description,
      category:
        typeof menuItem.category === 'string'
          ? menuItem.category
          : menuItem.category._id,
      price: menuItem.price,
      protein: menuItem.protein || 'none',
      spiceLevel: menuItem.spiceLevel || 0,
      isAvailable: menuItem.isAvailable,
    };

    this.selectedMenuItem.set(this.editableMenuItem);
  }

  // Close menu item overlay
  closeMenuItem(): void {
    this.selectedMenuItem.set(null);
    this.isCreatingMenuItem.set(false);
    this.menuItemValidationErrors.set([]);
    this.menuItemErrorMessage.set('');
  }

  // Save menu item
  saveMenuItem(): void {
    const menuItem = this.selectedMenuItem();

    if (!menuItem) {
      return;
    }

    if (!this.validateMenuItem()) {
      return;
    }

    this.isSavingMenuItem.set(true);
    this.menuItemErrorMessage.set('');

    const menuItemPayload = {
      name: menuItem.name.trim(),
      description: menuItem.description.trim(),
      category: menuItem.category,
      price: menuItem.price,
      protein: menuItem.protein,
      spiceLevel: menuItem.spiceLevel,
      isAvailable: menuItem.isAvailable,
    };

    const request = this.isCreatingMenuItem()
      ? this.menuService.createMenuItem(menuItemPayload)
      : this.menuService.updateMenuItem(menuItem.id, menuItemPayload);

    request.subscribe({
      next: () => {
        this.loadMenuItems();
        this.closeMenuItem();
        this.isSavingMenuItem.set(false);
      },
      error: () => {
        this.menuItemErrorMessage.set('Rätten kunde inte sparas.');
        this.isSavingMenuItem.set(false);
      },
    });
  }

  // Validate menu item before saving
  validateMenuItem(): boolean {
    const errors: string[] = [];
    const invalidFields: string[] = [];

    if (!this.editableMenuItem.name.trim()) {
      errors.push('Rätten måste ha ett namn.');
      invalidFields.push('menu-item-name');
    }

    if (!this.editableMenuItem.description.trim()) {
      errors.push('Rätten måste ha en beskrivning.');
      invalidFields.push('menu-item-description');
    }

    if (!this.editableMenuItem.category) {
      errors.push('Rätten måste tillhöra en kategori.');
      invalidFields.push('menu-item-category');
    }

    if (this.editableMenuItem.price <= 0) {
      errors.push('Priset måste vara högre än 0 kr.');
      invalidFields.push('menu-item-price');
    }

    if (
      this.editableMenuItem.spiceLevel < 0 ||
      this.editableMenuItem.spiceLevel > 3
    ) {
      errors.push('Styrkan måste vara mellan 0 och 3.');
      invalidFields.push('menu-item-spice');
    }

    this.menuItemValidationErrors.set(errors);
    this.invalidMenuItemFields.set(invalidFields);

    return errors.length === 0;
  }

  // Check if a menu item field is invalid for validation styling
  isInvalidMenuItemField(field: string): boolean {
    return this.invalidMenuItemFields().includes(field);
  }

  openMenuItemDeleteConfirmation(): void {
    const menuItem = this.selectedMenuItem();

    if (!menuItem) {
      return;
    }

    this.menuItemToDelete.set(menuItem);
    this.showMenuItemDeleteConfirmation.set(true);
  }

  closeMenuItemDeleteConfirmation(): void {
    this.menuItemToDelete.set(null);
    this.showMenuItemDeleteConfirmation.set(false);
  }

// Delete menu item
  deleteMenuItem(): void {
    const menuItem = this.menuItemToDelete();

    if (!menuItem) {
      return;
    }

    this.isDeletingMenuItem.set(true);
    this.menuItemErrorMessage.set('');

    this.menuService.deleteMenuItem(menuItem.id).subscribe({
      next: () => {
        this.loadMenuItems();
        this.closeMenuItemDeleteConfirmation();
        this.closeMenuItem();
        this.isDeletingMenuItem.set(false);
      },
      error: () => {
        this.menuItemErrorMessage.set('Rätten kunde inte raderas.');
        this.isDeletingMenuItem.set(false);
      },
    });
  }

  // Open overlay for new category
  openNewCategory(): void {
    this.isCreatingCategory.set(true);

    this.editableCategory = {
      id: '',
      name: '',
      description: '',
      image: undefined,
    };

    this.selectedCategory.set(this.editableCategory);
  }

  // Open overlay for existing category
  openCategory(category: MenuCategory): void {
    this.isCreatingCategory.set(false);

    this.editableCategory = {
      id: category._id,
      name: category.name,
      description: category.description || '',
      image: category.image,
    };

    this.selectedCategory.set(this.editableCategory);
  }

  // Close category overlay
  closeCategory(): void {
    this.selectedCategory.set(null);
    this.isCreatingCategory.set(false);
  }

  // Create slug from category name
  createSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replaceAll('å', 'a')
      .replaceAll('ä', 'a')
      .replaceAll('ö', 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  getCategoryImageUrl(imagePath?: string): string | null {
    if (!imagePath) {
      return null;
    }

    return `https://neo-tokyo-kitchen-api.onrender.com${imagePath}`;
  }

  // Save category
  saveCategory(): void {
    const category = this.selectedCategory();

    if (!category) {
      return;
    }

    if (!this.validateCategory()) {
      return;
    }

    this.isSavingCategory.set(true);
    this.categoryErrorMessage.set('');

    const categoryPayload = {
      name: category.name.trim(),
      slug: this.createSlug(category.name),
      description: category.description.trim(),
    };

    const request = this.isCreatingCategory()
      ? this.menuService.createCategory(categoryPayload)
      : this.menuService.updateCategory(category.id, categoryPayload);

    request.subscribe({
      next: (savedCategory) => {
        if (this.selectedImageFile) {
          this.menuService
            .uploadCategoryImage(
              savedCategory._id,
              this.selectedImageFile,
              savedCategory.name
            )
            .subscribe({
              next: () => {
                this.loadCategories();
                this.closeCategory();
                this.selectedImageFile = null;
                this.imagePreviewUrl.set(null);
                this.isSavingCategory.set(false);
              },
              error: () => {
                this.categoryErrorMessage.set('Kategorin sparades, men bilden kunde inte laddas upp.');
                this.isSavingCategory.set(false);
              },
            });

          return;
        }

        this.loadCategories();
        this.closeCategory();
        this.isSavingCategory.set(false);
      },
      error: () => {
        this.categoryErrorMessage.set('Kategorin kunde inte sparas.');
        this.isSavingCategory.set(false);
      },
    });
  }

  // Open delete confirmation dialog
  openDeleteConfirmation(): void {
    const category = this.selectedCategory();

    if (!category || this.isCreatingCategory()) {
      return;
    }

    this.categoryToDelete.set(category);
    this.showDeleteConfirmation.set(true);
  }

  // Close delete confirmation dialog
  closeDeleteConfirmation(): void {
    this.categoryToDelete.set(null);
    this.showDeleteConfirmation.set(false);
  }

  // Delete category
  deleteCategory(): void {
    const category = this.categoryToDelete();

    if (!category) {
      return;
    }

    this.isDeletingCategory.set(true);
    this.categoryErrorMessage.set('');

    this.menuService.deleteCategory(category.id).subscribe({
      next: () => {
        this.loadCategories();
        this.closeDeleteConfirmation();
        this.closeCategory();
        this.isDeletingCategory.set(false);
      },
      error: () => {
        this.categoryErrorMessage.set('Kategorin kunde inte tas bort.');
        this.isDeletingCategory.set(false);
      },
    });
  }

  validateCategory(): boolean {
    const errors: string[] = [];

    if (!this.editableCategory.name.trim()) {
      errors.push('Kategorin måste ha ett namn.');
    }

    if (!this.editableCategory.description.trim()) {
      errors.push('Kategorin måste ha en beskrivning.');
    }

    this.categoryValidationErrors.set(errors);

    return errors.length === 0;
  }

  onCategoryImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.selectedImageFile = file;

    const previewUrl = URL.createObjectURL(file);

    this.imagePreviewUrl.set(previewUrl);
  }

  removeSelectedImage(): void {
    this.selectedImageFile = null;
    this.imagePreviewUrl.set(null);
  }
}