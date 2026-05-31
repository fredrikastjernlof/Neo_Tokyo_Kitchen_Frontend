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
}

@Component({
  selector: 'app-admin-menu',
  imports: [FormsModule],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminMenu implements OnInit {

  categories = signal<MenuCategory[]>([]);
  selectedCategory = signal<EditableCategory | null>(null);
  isCreatingCategory = signal(false);
  isSavingCategory = signal(false);
  categoryErrorMessage = signal('');

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

  saveCategory(): void {
    const category = this.selectedCategory();

    if (!category) {
      return;
    }

    if (!category.name.trim()) {
      this.categoryErrorMessage.set('Kategorin måste ha ett namn.');
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
      next: () => {
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
}