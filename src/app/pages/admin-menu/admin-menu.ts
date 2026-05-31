import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import 'iconify-icon';

import {
  MenuCategory,
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

@Component({
  selector: 'app-admin-menu',
  imports: [FormsModule],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminMenu implements OnInit {

  // State signals
  categories = signal<MenuCategory[]>([]);
  selectedCategory = signal<EditableCategory | null>(null);
  isCreatingCategory = signal(false);
  isSavingCategory = signal(false);
  categoryErrorMessage = signal('');
  categoryToDelete = signal<EditableCategory | null>(null);
  showDeleteConfirmation = signal(false);
  isDeletingCategory = signal(false);
  categoryValidationErrors = signal<string[]>([]);

  selectedImageFile: File | null = null;
  imagePreviewUrl = signal<string | null>(null);

  editableCategory: EditableCategory = {
    id: '',
    name: '',
    description: '',
  };

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.loadCategories();
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