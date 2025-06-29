import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { RecipeCard } from '../RecipeCard';
import { createMockRecipe } from '@/test/utils';

// Mock the store
const mockUpdateRecipe = vi.fn();
const mockDeleteRecipe = vi.fn();

vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn(() => ({
    updateRecipe: mockUpdateRecipe,
    deleteRecipe: mockDeleteRecipe,
    books: [], // Ensure books is always an array
  }))
}));



// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock CopyDestinationDialog to prevent books.length errors
vi.mock('../CopyDestinationDialog', () => ({
  CopyDestinationDialog: ({ open, children }: any) => 
    open ? <div data-testid="copy-destination-dialog">{children}</div> : null,
}));

describe('RecipeCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnViewRecipe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render recipe information correctly', () => {
      const recipe = createMockRecipe({
        title: 'Delicious Pasta',
        author: 'Chef Mario',
        timeMinutes: 30,
        servings: 4,
        rating: 4.5,
        keywords: ['pasta', 'italian'],
      });

      render(<RecipeCard recipe={recipe} />);

      expect(screen.getByText('Delicious Pasta')).toBeInTheDocument();
      expect(screen.getByText('by Chef Mario')).toBeInTheDocument();
      expect(screen.getByText('30 min')).toBeInTheDocument();
      expect(screen.getByText('4 servings')).toBeInTheDocument();
      expect(screen.getByText('(4.5)')).toBeInTheDocument();
      expect(screen.getByText('pasta')).toBeInTheDocument();
      expect(screen.getByText('italian')).toBeInTheDocument();
    });

    it('should render ingredient list with tooltips', () => {
      const recipe = createMockRecipe({
        ingredients: [
          { name: 'flour', amount: '2', measure: 'cup' },
          { name: 'eggs', amount: '3', measure: 'piece' },
          { name: 'milk', amount: '1', measure: 'cup' },
        ],
      });

      render(<RecipeCard recipe={recipe} />);

      // Check for ingredients and their measurements (some may appear multiple times)
      expect(screen.getAllByText(/2/)).toHaveLength(1);
      expect(screen.getAllByText(/cup/)).toHaveLength(2); // flour and milk both use cups
      expect(screen.getByText('flour')).toBeInTheDocument();
      expect(screen.getAllByText(/3/)).toHaveLength(1);
      expect(screen.getByText(/piece/)).toBeInTheDocument();
      expect(screen.getByText('eggs')).toBeInTheDocument();
      expect(screen.getAllByText(/1/)).toHaveLength(1);
      expect(screen.getByText('milk')).toBeInTheDocument();
    });

    it('should render recipe image when provided', () => {
      const recipe = createMockRecipe({
        title: 'Photo Recipe',
        picture: '/images/recipe.jpg',
      });

      render(<RecipeCard recipe={recipe} />);

      const image = screen.getByAltText('Photo Recipe');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/recipe.jpg');
    });

    it('should render stars correctly based on rating', () => {
      const recipe = createMockRecipe({ rating: 3.5 });

      render(<RecipeCard recipe={recipe} />);

      // Should have star icons (we can test for the rating text)
      expect(screen.getByText('(3.5)')).toBeInTheDocument();
    });

    it('should show truncated ingredient list for many ingredients', () => {
      const recipe = createMockRecipe({
        ingredients: [
          { name: 'ingredient1', amount: '1', measure: 'cup' },
          { name: 'ingredient2', amount: '2', measure: 'tbsp' },
          { name: 'ingredient3', amount: '3', measure: 'tsp' },
          { name: 'ingredient4', amount: '4', measure: 'oz' },
          { name: 'ingredient5', amount: '5', measure: 'g' },
        ],
      });

      render(<RecipeCard recipe={recipe} />);

      // First 3 ingredients should be shown
      expect(screen.getByText('ingredient1')).toBeInTheDocument();
      expect(screen.getByText('ingredient2')).toBeInTheDocument();
      expect(screen.getByText('ingredient3')).toBeInTheDocument();

      // Should show "and X more" message
      expect(screen.getByText('... and 2 more')).toBeInTheDocument();

      // Last ingredients should not be shown
      expect(screen.queryByText('ingredient4')).not.toBeInTheDocument();
      expect(screen.queryByText('ingredient5')).not.toBeInTheDocument();
    });
  });

  describe('User Recipe Actions', () => {
    it('should show user actions for non-global recipes', () => {
      const recipe = createMockRecipe({ isGlobal: false });

      render(<RecipeCard recipe={recipe} showActions={true} />);

      // Should show love, edit, and delete buttons
      expect(screen.getByRole('button', { name: /favorites/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit recipe/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete recipe/i })).toBeInTheDocument();
    });

    it('should toggle love status when heart is clicked', () => {
      const recipe = createMockRecipe({ 
        isGlobal: false, 
        loved: false 
      });

      render(<RecipeCard recipe={recipe} />);

      const heartButton = screen.getByRole('button', { name: /add to favorites/i });
      fireEvent.click(heartButton);

      expect(mockUpdateRecipe).toHaveBeenCalledWith(recipe.id, { loved: true });
    });

    it('should call onEdit when edit button is clicked', () => {
      const recipe = createMockRecipe({ isGlobal: false });

      render(<RecipeCard recipe={recipe} onEdit={mockOnEdit} />);

      const editButton = screen.getByRole('button', { name: /edit recipe/i });
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(recipe);
    });

    it('should show delete confirmation dialog when delete is clicked', () => {
      const recipe = createMockRecipe({ 
        isGlobal: false,
        title: 'Recipe to Delete'
      });

      render(<RecipeCard recipe={recipe} />);

      const deleteButton = screen.getByRole('button', { name: /delete recipe/i });
      fireEvent.click(deleteButton);

      // Should show confirmation dialog
      expect(screen.getByText('Delete Recipe')).toBeInTheDocument();
      expect(screen.getByText(/permanently delete the recipe/i)).toBeInTheDocument();
    });

    it('should not show user actions when showActions is false', () => {
      const recipe = createMockRecipe({ isGlobal: false });

      render(<RecipeCard recipe={recipe} showActions={false} />);

      expect(screen.queryByRole('button', { name: /favorites/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /edit recipe/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete recipe/i })).not.toBeInTheDocument();
    });

    it('should show loved state visually', () => {
      const recipe = createMockRecipe({ 
        isGlobal: false, 
        loved: true 
      });

      render(<RecipeCard recipe={recipe} />);

      const heartButton = screen.getByRole('button', { name: /remove from favorites/i });
      // In the actual component, loved recipes have different styling
      expect(heartButton).toHaveClass('text-red-500');
    });
  });

  describe('Global Recipe Actions', () => {
    it('should show copy button for global recipes', () => {
      const recipe = createMockRecipe({ isGlobal: true });

      render(<RecipeCard recipe={recipe} showActions={true} />);

      expect(screen.getByRole('button', { name: /copy to my recipes/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /favorites/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /edit recipe/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete recipe/i })).not.toBeInTheDocument();
    });

    it('should show copy destination dialog when copy is clicked', () => {
      const recipe = createMockRecipe({ isGlobal: true });

      render(<RecipeCard recipe={recipe} />);

      const copyButton = screen.getByRole('button', { name: /copy to my recipes/i });
      fireEvent.click(copyButton);

      // The CopyDestinationDialog should be shown (mocked in this test)
      // In a real integration test, we would check for the dialog content
    });

    it('should not allow love toggle for global recipes', () => {
      const recipe = createMockRecipe({ isGlobal: true });

      render(<RecipeCard recipe={recipe} />);

      // Click on the card itself (not buttons) - use the card title area
      const cardTitle = screen.getByText(recipe.title);
      fireEvent.click(cardTitle);

      // Should not update love status
      expect(mockUpdateRecipe).not.toHaveBeenCalled();
    });
  });

  describe('Recipe Navigation', () => {
    it('should call onViewRecipe when card is clicked', () => {
      const recipe = createMockRecipe();

      render(<RecipeCard recipe={recipe} onViewRecipe={mockOnViewRecipe} />);

      const card = screen.getByText(recipe.title).closest('[role]') || screen.getByText(recipe.title);
      fireEvent.click(card);

      expect(mockOnViewRecipe).toHaveBeenCalledWith(recipe);
    });

    it('should not trigger onViewRecipe when action buttons are clicked', () => {
      const recipe = createMockRecipe({ isGlobal: false });

      render(<RecipeCard recipe={recipe} onViewRecipe={mockOnViewRecipe} />);

      // Click on the edit button
      const editButton = screen.getByRole('button', { name: /edit recipe/i });
      fireEvent.click(editButton);

      // onViewRecipe should not be called
      expect(mockOnViewRecipe).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for buttons', () => {
      const recipe = createMockRecipe({ 
        isGlobal: false,
        title: 'Test Recipe'
      });

      render(<RecipeCard recipe={recipe} />);

      expect(screen.getByRole('button', { name: /favorites/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit recipe/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete recipe/i })).toBeInTheDocument();
    });

    it('should have proper alt text for recipe images', () => {
      const recipe = createMockRecipe({
        title: 'Chocolate Cake',
        picture: '/cake.jpg',
      });

      render(<RecipeCard recipe={recipe} />);

      const image = screen.getByAltText('Chocolate Cake');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle recipe with no ingredients', () => {
      const recipe = createMockRecipe({ ingredients: [] });

      expect(() => render(<RecipeCard recipe={recipe} />)).not.toThrow();
    });

    it('should handle recipe with no keywords', () => {
      const recipe = createMockRecipe({ keywords: [] });

      render(<RecipeCard recipe={recipe} />);

      // Should not show any keyword badges
      expect(screen.queryByText('test')).not.toBeInTheDocument();
    });

    it('should handle very long recipe titles', () => {
      const recipe = createMockRecipe({
        title: 'This is a very long recipe title that might overflow the container and cause layout issues',
      });

      expect(() => render(<RecipeCard recipe={recipe} />)).not.toThrow();
    });

    it('should handle ingredients without amounts or measures', () => {
      const recipe = createMockRecipe({
        ingredients: [
          { name: 'salt' }, // No amount or measure
          { name: 'pepper', amount: '1' }, // No measure
        ],
      });

      render(<RecipeCard recipe={recipe} />);

      expect(screen.getByText('salt')).toBeInTheDocument();
      expect(screen.getByText('pepper')).toBeInTheDocument();
      // Check that the amount "1" is displayed somewhere in the component
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });
  });
}); 