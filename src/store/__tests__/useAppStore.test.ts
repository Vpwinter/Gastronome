import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '../useAppStore';
import { createMockRecipe, createMockBook, mockLocalStorage } from '@/test/utils';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state
    useAppStore.setState({
      recipes: [],
      books: [],
      courses: [],
      globalRecipes: [],
      globalBooks: [],
      globalCourses: [],
      theme: 'light',
      currentView: 'recipes',
    });
    
    // Clear localStorage mock
    mockLocalStorage.clear();
  });

  describe('Recipe CRUD Operations', () => {
    it('should add a new recipe', () => {
      const store = useAppStore.getState();
      const newRecipe = {
        title: 'Test Recipe',
        author: 'Test Chef',
        keywords: ['test'],
        ingredients: [{ name: 'flour', amount: '2', measure: 'cup' as const }],
        steps: ['Mix ingredients'],
        timeMinutes: 30,
        servings: 4,
        loved: false,
        rating: 4,
        comments: [],
      };

      const recipeId = store.addRecipe(newRecipe);
      const recipes = useAppStore.getState().recipes;

      expect(recipeId).toMatch(/^[a-z0-9]{9}$/); // nanoid format
      expect(recipes).toHaveLength(1);
      expect(recipes[0]).toMatchObject({
        ...newRecipe,
        id: recipeId,
      });
      expect(recipes[0].createdAt).toBeInstanceOf(Date);
      expect(recipes[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should update an existing recipe', async () => {
      const store = useAppStore.getState();
      const mockRecipe = createMockRecipe();
      
      // Add recipe first
      const recipeId = store.addRecipe(mockRecipe);
      
      // Wait a millisecond to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      
      // Update the recipe
      store.updateRecipe(recipeId, { 
        title: 'Updated Recipe',
        loved: true,
        rating: 5 
      });

      const recipes = useAppStore.getState().recipes;
      expect(recipes[0].title).toBe('Updated Recipe');
      expect(recipes[0].loved).toBe(true);
      expect(recipes[0].rating).toBe(5);
      expect(recipes[0].updatedAt.getTime()).toBeGreaterThanOrEqual(recipes[0].createdAt.getTime());
    });

    it('should delete a recipe', () => {
      const store = useAppStore.getState();
      const mockRecipe = createMockRecipe();
      
      // Add recipe first
      const recipeId = store.addRecipe(mockRecipe);
      expect(useAppStore.getState().recipes).toHaveLength(1);
      
      // Delete the recipe
      store.deleteRecipe(recipeId);
      expect(useAppStore.getState().recipes).toHaveLength(0);
    });

    it('should handle deleting non-existent recipe gracefully', () => {
      const store = useAppStore.getState();
      
      // Try to delete non-existent recipe
      expect(() => store.deleteRecipe('non-existent-id')).not.toThrow();
      expect(useAppStore.getState().recipes).toHaveLength(0);
    });

    it('should copy global recipe to user recipes', () => {
      const store = useAppStore.getState();
      const globalRecipe = createMockRecipe({ 
        id: 'global-recipe-1',
        isGlobal: true,
        title: 'Global Recipe' 
      });
      
      // Set up global recipe
      useAppStore.setState({ globalRecipes: [globalRecipe] });
      
      const copiedId = store.copyGlobalRecipe(globalRecipe);
      const recipes = useAppStore.getState().recipes;
      
      expect(recipes).toHaveLength(1);
      expect(recipes[0].id).toBe(copiedId);
      expect(recipes[0].title).toBe('Global Recipe');
      expect(recipes[0].isGlobal).toBe(false);
      expect(recipes[0].originalId).toBe('global-recipe-1');
    });
  });

  describe('Book CRUD Operations', () => {
    it('should add a new book', () => {
      const store = useAppStore.getState();
      const newBook = {
        title: 'Test Cookbook',
        author: 'Test Author',
        description: 'A test book',
        categories: ['Desserts'],
        keywords: ['test'],
        recipeIds: [],
        loved: false,
        rating: 4,
        comments: [],
      };

      const bookId = store.addBook(newBook);
      const books = useAppStore.getState().books;

      expect(bookId).toMatch(/^[a-z0-9]{9}$/); // nanoid format
      expect(books).toHaveLength(1);
      expect(books[0]).toMatchObject({
        ...newBook,
        id: bookId,
      });
    });

    it('should update an existing book', () => {
      const store = useAppStore.getState();
      const mockBook = createMockBook();
      
      const bookId = store.addBook(mockBook);
      
      store.updateBook(bookId, { 
        title: 'Updated Book',
        rating: 5 
      });

      const books = useAppStore.getState().books;
      expect(books[0].title).toBe('Updated Book');
      expect(books[0].rating).toBe(5);
    });

    it('should delete a book and its associated recipes (cascade delete)', () => {
      const store = useAppStore.getState();
      
      // Add recipes first
      const recipe1Id = store.addRecipe(createMockRecipe({ title: 'Recipe 1' }));
      const recipe2Id = store.addRecipe(createMockRecipe({ title: 'Recipe 2' }));
      store.addRecipe(createMockRecipe({ title: 'Recipe 3' }));
      
      // Add book with some recipes
      const book = createMockBook({ recipeIds: [recipe1Id, recipe2Id] });
      const bookId = store.addBook(book);
      
      expect(useAppStore.getState().recipes).toHaveLength(3);
      expect(useAppStore.getState().books).toHaveLength(1);
      
      // Delete the book
      store.deleteBook(bookId);
      
      const state = useAppStore.getState();
      expect(state.books).toHaveLength(0);
      expect(state.recipes).toHaveLength(1); // Only recipe3 should remain
      expect(state.recipes[0].title).toBe('Recipe 3');
    });

    it('should add recipe to book', () => {
      const store = useAppStore.getState();
      
      const recipeId = store.addRecipe(createMockRecipe());
      const bookId = store.addBook(createMockBook({ recipeIds: [] }));
      
      store.addRecipeToBook(bookId, recipeId);
      
      const books = useAppStore.getState().books;
      expect(books[0].recipeIds).toContain(recipeId);
    });

    it('should handle adding recipe to non-existent book gracefully', () => {
      const store = useAppStore.getState();
      const recipeId = store.addRecipe(createMockRecipe());
      
      expect(() => store.addRecipeToBook('non-existent-book', recipeId)).not.toThrow();
    });
  });

  describe('Theme and UI State', () => {
    it('should update theme', () => {
      const store = useAppStore.getState();
      
      store.setTheme('dark');
      expect(useAppStore.getState().theme).toBe('dark');
      
      store.setTheme('cozy');
      expect(useAppStore.getState().theme).toBe('cozy');
    });

    it('should update current view', () => {
      const store = useAppStore.getState();
      
      store.setCurrentView('books');
      expect(useAppStore.getState().currentView).toBe('books');
      
      store.setCurrentView('ingredient-recommender');
      expect(useAppStore.getState().currentView).toBe('ingredient-recommender');
    });
  });

  describe('Persistence', () => {
    it('should save state to localStorage', () => {
      // Mock window object first, before any store operations
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });
      
      const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
      const store = useAppStore.getState();
      
      // Add some data
      store.addRecipe(createMockRecipe());
      store.addBook(createMockBook());
      store.setTheme('dark');
      
      // Verify save was called (addRecipe, addBook, setTheme each call saveToStorage)
      expect(setItemSpy).toHaveBeenCalledTimes(3);
      expect(setItemSpy).toHaveBeenCalledWith('gastronome-data', expect.any(String));
    });

    it('should load state from localStorage', () => {
      const store = useAppStore.getState();
      
      // Mock stored data
      const storedData = {
        recipes: [createMockRecipe({ title: 'Stored Recipe' })],
        books: [createMockBook({ title: 'Stored Book' })],
        theme: 'cozy',
        courses: []
      };
      
      // Mock window.localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue(JSON.stringify(storedData)),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });
      
      // Load from storage
      store.loadFromStorage();
      
      const state = useAppStore.getState();
      expect(state.recipes).toHaveLength(1);
      expect(state.recipes[0].title).toBe('Stored Recipe');
      expect(state.books).toHaveLength(1);
      expect(state.books[0].title).toBe('Stored Book');
      expect(state.theme).toBe('cozy');
    });

    it('should handle loading from empty localStorage gracefully', () => {
      const store = useAppStore.getState();
      
      // Ensure localStorage is empty
      mockLocalStorage.clear();
      
      expect(() => store.loadFromStorage()).not.toThrow();
      
      const state = useAppStore.getState();
      expect(state.recipes).toHaveLength(0);
      expect(state.books).toHaveLength(0);
      expect(state.theme).toBe('light'); // default theme
    });

    it('should handle corrupted localStorage data gracefully', () => {
      const store = useAppStore.getState();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock window.localStorage with corrupted data
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn().mockReturnValue('invalid-json'),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      });
      
      expect(() => store.loadFromStorage()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
}); 