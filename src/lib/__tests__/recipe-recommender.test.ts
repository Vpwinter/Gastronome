import { describe, it, expect } from 'vitest';
import { getRecipeRecommendations, getIngredientSuggestions } from '../recipe-recommender';
import { createMockRecipe } from '@/test/utils';

describe('Recipe Recommender', () => {
  describe('getRecipeRecommendations', () => {
    const sampleRecipes = [
      createMockRecipe({
        id: 'recipe-1',
        title: 'Chicken Pasta',
        ingredients: [
          { name: 'chicken breast', amount: '2', measure: 'piece' },
          { name: 'pasta', amount: '200', measure: 'g' },
          { name: 'garlic', amount: '3', measure: 'clove' },
          { name: 'olive oil', amount: '2', measure: 'tbsp' },
        ],
        timeMinutes: 30,
        rating: 4.5,
        loved: true,
      }),
      createMockRecipe({
        id: 'recipe-2',
        title: 'Simple Salad',
        ingredients: [
          { name: 'lettuce', amount: '1', measure: 'head' },
          { name: 'tomato', amount: '2', measure: 'piece' },
          { name: 'cucumber', amount: '1', measure: 'piece' },
          { name: 'olive oil', amount: '1', measure: 'tbsp' },
        ],
        timeMinutes: 10,
        rating: 3.5,
        loved: false,
      }),
      createMockRecipe({
        id: 'recipe-3',
        title: 'Chicken Soup',
        ingredients: [
          { name: 'chicken', amount: '1', measure: 'piece' },
          { name: 'onion', amount: '1', measure: 'piece' },
          { name: 'carrot', amount: '2', measure: 'piece' },
          { name: 'celery', amount: '2', measure: 'piece' },
          { name: 'water', amount: '1', measure: 'l' },
        ],
        timeMinutes: 120,
        rating: 4.0,
        loved: false,
      }),
    ];

    it('should return recipes when ingredients match', () => {
      const availableIngredients = ['chicken', 'pasta', 'garlic'];
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes);

      expect(recommendations).toHaveLength(2); // Chicken Pasta and Chicken Soup
      expect(recommendations[0].recipe.title).toBe('Chicken Pasta'); // Should be ranked higher
      expect(recommendations[0].matchScore).toBeGreaterThan(0);
    });

    it('should return fuzzy matches for similar ingredient names', () => {
      const availableIngredients = ['chicken breast', 'noodles']; // "noodles" should match "pasta"
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes);

      expect(recommendations.length).toBeGreaterThan(0);
      const chickenPasta = recommendations.find(r => r.recipe.title === 'Chicken Pasta');
      expect(chickenPasta).toBeDefined();
      expect(chickenPasta!.matchScore).toBeGreaterThan(0.39);
    });

    it('should respect minimum match score threshold', () => {
      const availableIngredients = ['lettuce'];
      
      // With low threshold, should find matches
      const lowThresholdRecs = getRecipeRecommendations(availableIngredients, sampleRecipes, {
        minMatchScore: 0.1,
      });
      expect(lowThresholdRecs.length).toBeGreaterThan(0);

      // With high threshold, should find fewer or no matches
      const highThresholdRecs = getRecipeRecommendations(availableIngredients, sampleRecipes, {
        minMatchScore: 0.8,
      });
      expect(highThresholdRecs.length).toBeLessThanOrEqual(lowThresholdRecs.length);
    });

    it('should limit results based on maxResults option', () => {
      const availableIngredients = ['chicken', 'olive oil'];
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes, {
        maxResults: 1,
      });

      expect(recommendations).toHaveLength(1);
    });

    it('should boost recipes with fewer ingredients when preferFewerIngredients is true', () => {
      const availableIngredients = ['lettuce', 'tomato', 'olive oil'];
      
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes, {
        preferFewerIngredients: true,
      });

      // Simple Salad (4 ingredients) should rank higher than others
      const saladRec = recommendations.find(r => r.recipe.title === 'Simple Salad');
      expect(saladRec).toBeDefined();
      expect(saladRec!.matchScore).toBeGreaterThan(0.5);
    });

    it('should boost quick recipes when preferQuickRecipes is true', () => {
      const availableIngredients = ['lettuce', 'tomato', 'chicken'];
      
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes, {
        preferQuickRecipes: true,
      });

      // Simple Salad (10 minutes) should get boosted
      const saladRec = recommendations.find(r => r.recipe.title === 'Simple Salad');
      const soupRec = recommendations.find(r => r.recipe.title === 'Chicken Soup');
      
      if (saladRec && soupRec) {
        expect(saladRec.matchScore).toBeGreaterThan(soupRec.matchScore * 0.8); // Accounting for time boost
      }
    });

    it('should boost highly rated and loved recipes', () => {
      const availableIngredients = ['chicken', 'pasta'];
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes);

      // Chicken Pasta has rating 4.5 and loved=true, should be boosted
      const chickenPasta = recommendations.find(r => r.recipe.title === 'Chicken Pasta');
      const chickenSoup = recommendations.find(r => r.recipe.title === 'Chicken Soup');
      
      if (chickenPasta && chickenSoup) {
        expect(chickenPasta.matchScore).toBeGreaterThan(chickenSoup.matchScore);
      }
    });

    it('should return empty array for no ingredient input', () => {
      const recommendations = getRecipeRecommendations([], sampleRecipes);
      expect(recommendations).toHaveLength(0);
    });

    it('should return empty array when no recipes match', () => {
      const availableIngredients = ['extremely-rare-ingredient'];
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes);
      expect(recommendations).toHaveLength(0);
    });

    it('should handle recipes with no ingredients gracefully', () => {
      const emptyRecipe = createMockRecipe({
        title: 'Empty Recipe',
        ingredients: [],
      });
      const recipesWithEmpty = [...sampleRecipes, emptyRecipe];
      
      const availableIngredients = ['chicken'];
      const recommendations = getRecipeRecommendations(availableIngredients, recipesWithEmpty);
      
      // Should not include the empty recipe
      expect(recommendations.find(r => r.recipe.title === 'Empty Recipe')).toBeUndefined();
    });

    it('should provide correct missing and available ingredients', () => {
      const availableIngredients = ['chicken', 'pasta'];
      const recommendations = getRecipeRecommendations(availableIngredients, sampleRecipes);

      const chickenPasta = recommendations.find(r => r.recipe.title === 'Chicken Pasta');
      expect(chickenPasta).toBeDefined();
      
      if (chickenPasta) {
        expect(chickenPasta.availableIngredients).toContain('chicken');
        expect(chickenPasta.missingIngredients).toContain('garlic');
        expect(chickenPasta.missingIngredients).toContain('olive oil');
      }
    });
  });

  describe('getIngredientSuggestions', () => {
    it('should suggest complementary ingredients for chicken', () => {
      const currentIngredients = ['chicken'];
      const suggestions = getIngredientSuggestions(currentIngredients);

      expect(suggestions).toContain('onion');
      expect(suggestions).toContain('garlic');
      expect(suggestions).toContain('herbs');
    });

    it('should suggest complementary ingredients for tomato', () => {
      const currentIngredients = ['tomato'];
      const suggestions = getIngredientSuggestions(currentIngredients);

      expect(suggestions).toContain('basil');
      expect(suggestions).toContain('onion');
      expect(suggestions).toContain('garlic');
      expect(suggestions).toContain('mozzarella');
    });

    it('should suggest ingredients for pasta dishes', () => {
      const currentIngredients = ['pasta'];
      const suggestions = getIngredientSuggestions(currentIngredients);

      expect(suggestions).toContain('tomato');
      expect(suggestions).toContain('garlic');
      expect(suggestions).toContain('olive oil');
      expect(suggestions).toContain('parmesan');
    });

    it('should not suggest ingredients already in the list', () => {
      const currentIngredients = ['chicken', 'onion', 'garlic'];
      const suggestions = getIngredientSuggestions(currentIngredients);

      expect(suggestions).not.toContain('chicken');
      expect(suggestions).not.toContain('onion');
      expect(suggestions).not.toContain('garlic');
    });

    it('should return empty array for unrecognized ingredients', () => {
      const currentIngredients = ['very-rare-exotic-ingredient'];
      const suggestions = getIngredientSuggestions(currentIngredients);

      expect(suggestions).toHaveLength(0);
    });

    it('should limit suggestions to reasonable number', () => {
      const currentIngredients = ['tomato', 'onion']; // Should trigger multiple suggestion sets
      const suggestions = getIngredientSuggestions(currentIngredients);

      expect(suggestions.length).toBeLessThanOrEqual(10);
    });

    it('should handle multiple ingredients and combine suggestions', () => {
      const currentIngredients = ['chicken', 'tomato'];
      const suggestions = getIngredientSuggestions(currentIngredients);

      // Should get suggestions from both chicken and tomato combinations
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions).toContain('herbs'); // From chicken
      expect(suggestions).toContain('basil'); // From tomato
    });

    it('should handle empty ingredient list', () => {
      const suggestions = getIngredientSuggestions([]);
      expect(suggestions).toHaveLength(0);
    });
  });
}); 