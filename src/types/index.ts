export const COOKING_MEASURES = [
  // Volume - Metric
  'ml', 'l', 'dl', 'cl',
  
  // Volume - Imperial/US
  'tsp', 'tbsp', 'fl oz', 'cup', 'pint', 'quart', 'gallon',
  
  // Weight - Metric
  'g', 'kg', 'mg',
  
  // Weight - Imperial/US
  'oz', 'lb', 'stone',
  
  // Pieces/Count
  'piece', 'pieces', 'slice', 'slices', 'clove', 'cloves',
  'dozen', 'half dozen', 'bunch', 'head', 'can', 'jar',
  'bottle', 'packet', 'bag', 'box', 'tin',
  
  // Special/Approximate
  'pinch', 'dash', 'splash', 'handful', 'q.s.', 'to taste',
  
  // Length
  'inch', 'inches', 'cm', 'mm',
  
  // Temperature
  '°F', '°C'
] as const;

export type CookingMeasure = typeof COOKING_MEASURES[number] | '';

export interface Ingredient {
  name: string;
  amount?: string; // q.s., 100, dozen, 50, etc.
  measure?: CookingMeasure; // standardized cooking measures
}

export interface Recipe {
  id: string;
  title: string;
  author: string;
  picture?: string;
  keywords: string[];
  ingredients: Ingredient[];
  steps: string[];
  timeMinutes: number;
  servings: number;
  loved: boolean;
  rating: number; // 0-5 stars
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  isGlobal?: boolean; // true if from global scope
  originalId?: string; // if copied from global scope
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  picture?: string;
  categories: string[];
  keywords: string[];
  recipeIds: string[];
  loved: boolean;
  rating: number; // 0-5 stars
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  isGlobal?: boolean;
  originalId?: string;
}

export interface Course {
  id: string;
  title: string;
  author: string;
  description?: string;
  picture?: string;
  bookIds: string[];
  loved: boolean;
  rating: number;
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  isGlobal?: boolean;
  originalId?: string;
}

export type Theme = 'light' | 'dark' | 'cozy' | 'seasonal';

export interface AppState {
  // Data
  recipes: Recipe[];
  books: Book[];
  courses: Course[];
  globalRecipes: Recipe[];
  globalBooks: Book[];
  globalCourses: Course[];
  
  // UI State
  theme: Theme;
  currentView: 'recipes' | 'books' | 'courses' | 'search' | 'tools';
  
  // Actions
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  copyGlobalRecipe: (globalRecipe: Recipe) => string;
  
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  copyGlobalBook: (globalBook: Book) => string;
  addRecipeToBook: (bookId: string, recipeId: string) => void;
  
  setTheme: (theme: Theme) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  
  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
} 