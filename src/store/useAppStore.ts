import { create } from 'zustand';
import { AppState, Recipe, Book, Theme } from '../types';

// Sample global data for discovery
const SAMPLE_GLOBAL_RECIPES: Recipe[] = [
  {
    id: 'global-1',
    title: 'Classic Pasta Carbonara',
    author: 'Chef Marco',
    keywords: ['pasta', 'italian', 'quick'],
    ingredients: [
      { name: 'spaghetti', amount: '400', measure: 'g' },
      { name: 'pancetta', amount: '200', measure: 'g' },
      { name: 'eggs', amount: '4', measure: '' },
      { name: 'pecorino cheese', amount: '100', measure: 'g' },
      { name: 'black pepper', amount: 'q.s.', measure: '' },
      { name: 'salt', amount: 'q.s.', measure: '' }
    ],
    steps: [
      'Cook pasta according to package instructions',
      'Fry pancetta until crispy',
      'Beat eggs with cheese and pepper',
      'Combine hot pasta with pancetta, then add egg mixture off heat',
      'Toss quickly and serve immediately'
    ],
    timeMinutes: 20,
    servings: 4,
    loved: false,
    rating: 4.5,
    comments: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isGlobal: true
  },
  {
    id: 'global-2',
    title: 'Chocolate Chip Cookies',
    author: 'Baker Sarah',
    keywords: ['cookies', 'dessert', 'baking'],
    ingredients: [
      { name: 'flour', amount: '2 1/4', measure: 'cup' },
      { name: 'baking soda', amount: '1', measure: 'tsp' },
      { name: 'salt', amount: '1', measure: 'tsp' },
      { name: 'butter', amount: '1', measure: 'cup' },
      { name: 'sugar', amount: '3/4', measure: 'cup' },
      { name: 'eggs', amount: '2', measure: '' },
      { name: 'chocolate chips', amount: '2', measure: 'cup' }
    ],
    steps: [
      'Preheat oven to 375°F',
      'Mix dry ingredients',
      'Cream butter and sugars',
      'Add eggs and vanilla',
      'Combine wet and dry ingredients',
      'Fold in chocolate chips',
      'Bake for 9-11 minutes'
    ],
    timeMinutes: 45,
    servings: 24,
    loved: false,
    rating: 4.8,
    comments: [],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    isGlobal: true
  },
  {
    id: 'global-3',
    title: 'Spicy Chicken Tikka Masala',
    author: 'Chef Priya',
    keywords: ['chicken', 'spicy', 'indian'],
    ingredients: [
      { name: 'chicken breast', amount: '500', measure: 'g' },
      { name: 'yogurt', amount: '1', measure: 'cup' },
      { name: 'garam masala', amount: '2', measure: 'tsp' },
      { name: 'tomato puree', amount: '1', measure: 'cup' },
      { name: 'cream', amount: '1/2', measure: 'cup' },
      { name: 'garlic', amount: '3', measure: 'cloves' },
      { name: 'ginger', amount: '1', measure: 'tbsp' },
      { name: 'cumin', amount: '1', measure: 'tsp' },
      { name: 'salt', amount: 'q.s.', measure: '' },
      { name: 'chili powder', amount: '1', measure: 'tsp' }
    ],
    steps: [
      'Marinate chicken in yogurt and spices for 1 hour',
      'Grill or sauté chicken until cooked',
      'Prepare sauce with garlic, ginger, tomato puree, and spices',
      'Add cream and simmer until thickened',
      'Combine with chicken and cook 10 more minutes'
    ],
    timeMinutes: 60,
    servings: 4,
    loved: false,
    rating: 4.7,
    comments: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isGlobal: true
  },
  {
    id: 'global-4',
    title: 'Avocado Toast with Poached Egg',
    author: 'Chef Emma',
    keywords: ['breakfast', 'healthy', 'quick'],
    ingredients: [
      { name: 'bread slices', amount: '2', measure: '' },
      { name: 'avocado', amount: '1', measure: '' },
      { name: 'eggs', amount: '2', measure: '' },
      { name: 'lemon juice', amount: '1', measure: 'tsp' },
      { name: 'salt', amount: 'q.s.', measure: '' },
      { name: 'black pepper', amount: 'q.s.', measure: '' },
      { name: 'chili flakes', amount: '1/4', measure: 'tsp' }
    ],
    steps: [
      'Toast the bread slices',
      'Mash avocado with lemon juice, salt, and pepper',
      'Poach the eggs in simmering water',
      'Spread avocado mash on toast',
      'Top with poached egg and sprinkle chili flakes'
    ],
    timeMinutes: 15,
    servings: 1,
    loved: false,
    rating: 4.4,
    comments: [],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
    isGlobal: true
  },
  {
    id: 'global-5',
    title: 'Thai Green Curry',
    author: 'Chef Anong',
    keywords: ['thai', 'spicy', 'curry'],
    ingredients: [
      { name: 'chicken breast', amount: '500', measure: 'g' },
      { name: 'green curry paste', amount: '3', measure: 'tbsp' },
      { name: 'coconut milk', amount: '400', measure: 'ml' },
      { name: 'bamboo shoots', amount: '150', measure: 'g' },
      { name: 'fish sauce', amount: '2', measure: 'tbsp' },
      { name: 'sugar', amount: '1', measure: 'tsp' },
      { name: 'basil leaves', amount: '1', measure: 'handful' },
      { name: 'lime leaves', amount: '3', measure: '' }
    ],
    steps: [
      'Fry curry paste in a pan until aromatic',
      'Add coconut milk and bring to simmer',
      'Add chicken and cook until done',
      'Stir in bamboo shoots, fish sauce, sugar, and lime leaves',
      'Simmer for 5 minutes and garnish with basil leaves'
    ],
    timeMinutes: 25,
    servings: 4,
    loved: false,
    rating: 4.7,
    comments: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isGlobal: true
  },
  {
    id: 'global-6',
    title: 'Fluffy Pancakes',
    author: 'Baker Lily',
    keywords: ['breakfast', 'pancake', 'easy'],
    ingredients: [
      { name: 'flour', amount: '1 1/2', measure: 'cup' },
      { name: 'baking powder', amount: '3 1/2', measure: 'tsp' },
      { name: 'salt', amount: '1', measure: 'tsp' },
      { name: 'milk', amount: '1 1/4', measure: 'cup' },
      { name: 'egg', amount: '1', measure: '' },
      { name: 'butter (melted)', amount: '3', measure: 'tbsp' },
      { name: 'sugar', amount: '1', measure: 'tbsp' }
    ],
    steps: [
      'Mix dry ingredients in a bowl',
      'Whisk milk, egg, and melted butter in another bowl',
      'Combine wet and dry ingredients to form a smooth batter',
      'Heat a pan and pour 1/4 cup batter for each pancake',
      'Cook until bubbles form, flip and cook until golden'
    ],
    timeMinutes: 20,
    servings: 6,
    loved: false,
    rating: 4.9,
    comments: [],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
    isGlobal: true
  }
];

const SAMPLE_GLOBAL_BOOKS: Book[] = [
  {
    id: 'global-book-1',
    title: 'Italian Classics',
    author: 'Chef Marco',
    description: 'Traditional Italian recipes passed down through generations',
    categories: ['Italian', 'Traditional'],
    keywords: ['pasta', 'pizza', 'risotto'],
    recipeIds: ['global-1'],
    loved: false,
    rating: 4.6,
    comments: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isGlobal: true
  },
  {
    id: 'global-book-2',
    title: 'Sweet Treats & Desserts',
    author: 'Baker Sarah',
    description: 'Indulgent desserts and sweet treats for every occasion',
    categories: ['Desserts', 'Baking'],
    keywords: ['cookies', 'cakes', 'sweet', 'dessert'],
    recipeIds: ['global-2'],
    loved: false,
    rating: 4.8,
    comments: [],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    isGlobal: true
  },
  {
    id: 'global-book-3',
    title: 'Quick & Easy Weeknight Meals',
    author: 'Chef Alex',
    description: 'Simple, delicious meals that can be prepared in 30 minutes or less',
    categories: ['Quick', 'Easy', 'Weeknight'],
    keywords: ['fast', 'simple', 'weeknight', 'easy'],
    recipeIds: [],
    loved: false,
    rating: 4.3,
    comments: [],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    isGlobal: true
  },
  {
    id: 'global-book-4',
    title: 'World Flavors: From India to the West',
    author: 'Chef Priya',
    description: 'A journey through bold, flavorful dishes from across the globe',
    categories: ['International', 'Spicy', 'Fusion'],
    keywords: ['indian', 'bold', 'flavorful'],
    recipeIds: ['global-3', 'global-4'],
    loved: false,
    rating: 4.9,
    comments: [],
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
    isGlobal: true
  },
  {
    id: 'global-book-5',
    title: 'Asian Spice',
    author: 'Chef Anong',
    description: 'A journey through bold and aromatic dishes from East and Southeast Asia',
    categories: ['Asian', 'Spicy'],
    keywords: ['thai', 'curry', 'spice'],
    recipeIds: ['global-3'],
    loved: false,
    rating: 4.7,
    comments: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isGlobal: true
  },
  {
    id: 'global-book-6',
    title: 'Brunch at Home',
    author: 'Baker Lily',
    description: 'Comforting brunch recipes to start your weekend right',
    categories: ['Breakfast', 'Brunch'],
    keywords: ['pancake', 'brunch', 'easy'],
    recipeIds: ['global-4'],
    loved: false,
    rating: 4.9,
    comments: [],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
    isGlobal: true
  }
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  recipes: [],
  books: [],
  courses: [],
  globalRecipes: SAMPLE_GLOBAL_RECIPES,
  globalBooks: SAMPLE_GLOBAL_BOOKS,
  globalCourses: [],
  theme: 'light',
  currentView: 'recipes',

  // Recipe actions
  addRecipe: (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const recipe: Recipe = {
      ...recipeData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state: AppState) => ({
      recipes: [...state.recipes, recipe]
    }));
    get().saveToStorage();
    return recipe.id;
  },

  updateRecipe: (id: string, updates: Partial<Recipe>) => {
    set((state: AppState) => ({
      recipes: state.recipes.map(recipe =>
        recipe.id === id
          ? { ...recipe, ...updates, updatedAt: new Date() }
          : recipe
      )
    }));
    get().saveToStorage();
  },

  deleteRecipe: (id: string) => {
    set((state: AppState) => ({
      recipes: state.recipes.filter(recipe => recipe.id !== id)
    }));
    get().saveToStorage();
  },

  copyGlobalRecipe: (globalRecipe: Recipe) => {
    const copiedRecipe: Recipe = {
      ...globalRecipe,
      id: generateId(),
      isGlobal: false,
      originalId: globalRecipe.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      loved: false,
      rating: 0,
      comments: []
    };
    set((state: AppState) => ({
      recipes: [...state.recipes, copiedRecipe]
    }));
    get().saveToStorage();
    return copiedRecipe.id;
  },

  // Book actions
  addBook: (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const book: Book = {
      ...bookData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state: AppState) => ({
      books: [...state.books, book]
    }));
    get().saveToStorage();
    return book.id;
  },

  updateBook: (id: string, updates: Partial<Book>) => {
    set((state: AppState) => ({
      books: state.books.map(book =>
        book.id === id
          ? { ...book, ...updates, updatedAt: new Date() }
          : book
      )
    }));
    get().saveToStorage();
  },

  deleteBook: (id: string) => {
    set((state: AppState) => ({
      books: state.books.filter(book => book.id !== id)
    }));
    get().saveToStorage();
  },

  copyGlobalBook: (globalBook: Book) => {
    const { globalRecipes } = get();
    
    // First, copy all recipes referenced by this book
    const copiedRecipeIds: string[] = [];
    globalBook.recipeIds.forEach(recipeId => {
      const globalRecipe = globalRecipes.find(r => r.id === recipeId);
      if (globalRecipe) {
        const newRecipeId = get().copyGlobalRecipe(globalRecipe);
        copiedRecipeIds.push(newRecipeId);
      }
    });
    
    // Then copy the book with the new recipe IDs
    const copiedBook: Book = {
      ...globalBook,
      id: generateId(),
      recipeIds: copiedRecipeIds,
      isGlobal: false,
      originalId: globalBook.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      loved: false,
      rating: 0,
      comments: []
    };
    set((state: AppState) => ({
      books: [...state.books, copiedBook]
    }));
    get().saveToStorage();
    return copiedBook.id;
  },

  addRecipeToBook: (bookId: string, recipeId: string) => {
    set((state: AppState) => ({
      books: state.books.map(book =>
        book.id === bookId
          ? { 
              ...book, 
              recipeIds: book.recipeIds.includes(recipeId) 
                ? book.recipeIds 
                : [...book.recipeIds, recipeId],
              updatedAt: new Date()
            }
          : book
      )
    }));
    get().saveToStorage();
  },

  // UI actions
  setTheme: (theme: Theme) => {
    set({ theme });
    get().saveToStorage();
  },

  setCurrentView: (view: AppState['currentView']) => {
    set({ currentView: view });
  },

  // Persistence
  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('gastronome-data');
      if (stored) {
        const data = JSON.parse(stored);
        set({
          recipes: data.recipes || [],
          books: data.books || [],
          courses: data.courses || [],
          theme: data.theme || 'light'
        });
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    
    try {
      const { recipes, books, courses, theme } = get();
      const dataToSave = {
        recipes,
        books,
        courses,
        theme
      };
      localStorage.setItem('gastronome-data', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }
})); 