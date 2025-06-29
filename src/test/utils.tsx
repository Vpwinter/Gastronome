import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Recipe, Book } from '@/types';
import { useAppStore } from '@/store/useAppStore';

// Test wrapper that provides store context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  // Reset store state for each test
  React.useEffect(() => {
    const store = useAppStore.getState();
    // Reset data arrays while keeping methods
    useAppStore.setState({
      recipes: [],
      books: [],
      courses: [],
      globalRecipes: [],
      globalBooks: [],
      globalCourses: [],
      theme: 'light',
      currentView: 'recipes'
    });
  }, []);

  return <>{children}</>;
};

// Custom render function - use wrapper only when needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data factories for consistent testing
export const createMockRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  id: 'test-recipe-1',
  title: 'Test Recipe',
  author: 'Test Chef',
  picture: '',
  keywords: ['test', 'recipe'],
  ingredients: [
    { name: 'flour', amount: '2', measure: 'cup' },
    { name: 'sugar', amount: '1', measure: 'cup' },
    { name: 'eggs', amount: '2', measure: 'piece' },
  ],
  steps: [
    'Mix dry ingredients',
    'Add wet ingredients',
    'Bake for 30 minutes',
  ],
  timeMinutes: 45,
  servings: 4,
  rating: 4.5,
  loved: false,
  comments: ['Delicious!'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  isGlobal: false,
  ...overrides,
});

export const createMockBook = (overrides: Partial<Book> = {}): Book => ({
  id: 'test-book-1',
  title: 'Test Cookbook',
  author: 'Test Author',
  description: 'A test cookbook for unit tests',
  picture: '',
  categories: ['Desserts'],
  keywords: ['test', 'cookbook'],
  recipeIds: ['test-recipe-1'],
  loved: false,
  rating: 4.0,
  comments: ['Great cookbook'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  isGlobal: false,
  ...overrides,
});

export const createMockIngredient = (overrides = {}) => ({
  name: 'test ingredient',
  amount: '1',
  measure: 'cup',
  ...overrides,
});

// Mock localStorage utilities
export const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: function (key: string) {
    return this.store[key] || null;
  },
  setItem: function (key: string, value: string) {
    this.store[key] = value.toString();
  },
  removeItem: function (key: string) {
    delete this.store[key];
  },
  clear: function () {
    this.store = {};
  },
};

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 