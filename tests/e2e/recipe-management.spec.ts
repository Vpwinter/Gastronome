import { test, expect } from '@playwright/test';

test.describe('Recipe Management', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
    
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
  });

  test('should create, edit, and delete a recipe', async ({ page }) => {
    // Navigate to recipes page
    await page.click('text=Recipes');
    
    // Should show empty state initially
    await expect(page.locator('text=No recipes found')).toBeVisible();
    
    // Click "Add Recipe" button
    await page.click('text=Add Recipe');
    
    // Fill out the recipe form
    await page.fill('[placeholder*="recipe title"]', 'E2E Test Recipe');
    await page.fill('[placeholder*="author"]', 'Test Chef');
    await page.fill('[placeholder*="time"]', '30');
    await page.fill('[placeholder*="servings"]', '4');
    
    // Add ingredients
    await page.fill('[placeholder*="ingredient name"]', 'flour');
    await page.fill('[placeholder*="amount"]', '2');
    await page.locator('[data-testid="measure-select"]').selectOption('cup');
    await page.click('text=Add Ingredient');
    
    await page.fill('[placeholder*="ingredient name"]', 'eggs');
    await page.fill('[placeholder*="amount"]', '3');
    await page.locator('[data-testid="measure-select"]').selectOption('piece');
    await page.click('text=Add Ingredient');
    
    // Add steps
    await page.fill('[placeholder*="step description"]', 'Mix the flour in a bowl');
    await page.click('text=Add Step');
    
    await page.fill('[placeholder*="step description"]', 'Add eggs and mix well');
    await page.click('text=Add Step');
    
    // Add keywords
    await page.fill('[placeholder*="keyword"]', 'breakfast');
    await page.press('[placeholder*="keyword"]', 'Enter');
    
    await page.fill('[placeholder*="keyword"]', 'easy');
    await page.press('[placeholder*="keyword"]', 'Enter');
    
    // Save the recipe
    await page.click('text=Save Recipe');
    
    // Should return to recipes list and show the new recipe
    await expect(page.locator('text=E2E Test Recipe')).toBeVisible();
    await expect(page.locator('text=by Test Chef')).toBeVisible();
    await expect(page.locator('text=30 min')).toBeVisible();
    await expect(page.locator('text=4 servings')).toBeVisible();
    
    // Click on the recipe to view details
    await page.click('text=E2E Test Recipe');
    
    // Verify recipe details page
    await expect(page.locator('h1', { hasText: 'E2E Test Recipe' })).toBeVisible();
    await expect(page.locator('text=by Test Chef')).toBeVisible();
    await expect(page.locator('text=2 cup flour')).toBeVisible();
    await expect(page.locator('text=3 piece eggs')).toBeVisible();
    await expect(page.locator('text=Mix the flour in a bowl')).toBeVisible();
    await expect(page.locator('text=Add eggs and mix well')).toBeVisible();
    
    // Edit the recipe
    await page.click('[aria-label="Edit"]');
    
    // Change the title
    await page.fill('[value="E2E Test Recipe"]', 'Updated E2E Recipe');
    
    // Save changes
    await page.click('text=Save Changes');
    
    // Verify the updated title
    await expect(page.locator('h1', { hasText: 'Updated E2E Recipe' })).toBeVisible();
    
    // Go back to recipes list
    await page.click('text=Back to Recipes');
    
    // Delete the recipe
    await page.click('[aria-label="Delete"]');
    
    // Confirm deletion
    await page.click('text=Delete');
    
    // Should return to empty state
    await expect(page.locator('text=No recipes found')).toBeVisible();
  });

  test('should create and manage books with recipes', async ({ page }) => {
    // First create a recipe
    await page.click('text=Recipes');
    await page.click('text=Add Recipe');
    
    await page.fill('[placeholder*="recipe title"]', 'Book Test Recipe');
    await page.fill('[placeholder*="author"]', 'Book Chef');
    await page.fill('[placeholder*="time"]', '20');
    await page.fill('[placeholder*="servings"]', '2');
    
    await page.fill('[placeholder*="ingredient name"]', 'pasta');
    await page.fill('[placeholder*="amount"]', '200');
    await page.locator('[data-testid="measure-select"]').selectOption('g');
    await page.click('text=Add Ingredient');
    
    await page.fill('[placeholder*="step description"]', 'Cook the pasta');
    await page.click('text=Add Step');
    
    await page.click('text=Save Recipe');
    
    // Navigate to books
    await page.click('text=Books');
    
    // Create a new book
    await page.click('text=Add Book');
    
    await page.fill('[placeholder*="book title"]', 'E2E Test Cookbook');
    await page.fill('[placeholder*="author"]', 'Cookbook Author');
    await page.fill('[placeholder*="description"]', 'A test cookbook for E2E testing');
    
    // Add category
    await page.fill('[placeholder*="category"]', 'Italian');
    await page.press('[placeholder*="category"]', 'Enter');
    
    // Add keyword
    await page.fill('[placeholder*="keyword"]', 'pasta');
    await page.press('[placeholder*="keyword"]', 'Enter');
    
    // Save the book
    await page.click('text=Save Book');
    
    // Should show the new book
    await expect(page.locator('text=E2E Test Cookbook')).toBeVisible();
    
    // View book details
    await page.click('text=E2E Test Cookbook');
    
    // Add recipe to book
    await page.click('text=Add Recipe to Book');
    await page.click('text=Book Test Recipe');
    
    // Should show the recipe in the book
    await expect(page.locator('text=Book Test Recipe')).toBeVisible();
  });

  test('should use ingredient recommender', async ({ page }) => {
    // Navigate to ingredient recommender
    await page.click('text=Ingredient Finder');
    
    // Add available ingredients
    await page.fill('[placeholder*="Enter an ingredient"]', 'chicken');
    await page.locator('text=Add').first().click(); // Add button for ingredients
    
    await page.fill('[placeholder*="Enter an ingredient"]', 'tomato');
    await page.locator('text=Add').first().click();
    
    // Should show ingredient badges
    await expect(page.locator('.badge', { hasText: 'chicken' })).toBeVisible();
    await expect(page.locator('.badge', { hasText: 'tomato' })).toBeVisible();
    
    // Should show recipe recommendations (if any global recipes exist)
    // In a real app, we'd seed some global recipes for testing
    await expect(page.locator('text=Recipe Recommendations')).toBeVisible();
    
    // Should show ingredient suggestions
    await expect(page.locator('text=Suggested Additions')).toBeVisible();
  });

  test('should access cooking tools via floating menu', async ({ page }) => {
    // The floating tools menu should be visible
    await expect(page.locator('[data-testid="floating-tools-menu"]')).toBeVisible();
    
    // Click the tools button to expand
    await page.click('[data-testid="floating-tools-button"]');
    
    // Should show tool options
    await expect(page.locator('[data-testid="substitution-tool"]')).toBeVisible();
    await expect(page.locator('[data-testid="converter-tool"]')).toBeVisible();
    
    // Test substitution wizard
    await page.click('[data-testid="substitution-tool"]');
    
    // Should open substitution dialog
    await expect(page.locator('text=Substitution Wizard')).toBeVisible();
    
    // Search for substitutions
    await page.fill('[placeholder*="Enter ingredient name"]', 'butter');
    
    // Should show substitution results
    await expect(page.locator('text=margarine')).toBeVisible();
    
    // Close dialog
    await page.press('Escape');
    
    // Test measurement converter
    await page.click('[data-testid="floating-tools-button"]');
    await page.click('[data-testid="converter-tool"]');
    
    // Should open converter dialog
    await expect(page.locator('text=Measurement Converter')).toBeVisible();
    
    // Test conversion
    await page.fill('[placeholder*="Enter amount"]', '1');
    await page.locator('[data-testid="from-unit"]').selectOption('cup');
    await page.locator('[data-testid="to-unit"]').selectOption('ml');
    
    // Should show conversion result
    await expect(page.locator('text=236.588 ml')).toBeVisible();
    
    // Close dialog
    await page.press('Escape');
  });

  test('should toggle love status and maintain state', async ({ page }) => {
    // Create a recipe first
    await page.click('text=Recipes');
    await page.click('text=Add Recipe');
    
    await page.fill('[placeholder*="recipe title"]', 'Love Test Recipe');
    await page.fill('[placeholder*="author"]', 'Love Chef');
    await page.fill('[placeholder*="time"]', '15');
    await page.fill('[placeholder*="servings"]', '1');
    
    await page.fill('[placeholder*="ingredient name"]', 'love');
    await page.click('text=Add Ingredient');
    
    await page.fill('[placeholder*="step description"]', 'Add love');
    await page.click('text=Add Step');
    
    await page.click('text=Save Recipe');
    
    // Toggle love status
    await page.click('[aria-label="Love"]');
    
    // Heart should be filled/red
    await expect(page.locator('[aria-label="Love"].text-red-500')).toBeVisible();
    
    // Refresh page to test persistence
    await page.reload();
    
    // Love status should be maintained
    await expect(page.locator('[aria-label="Love"].text-red-500')).toBeVisible();
    
    // Toggle off
    await page.click('[aria-label="Love"]');
    
    // Heart should be unfilled
    await expect(page.locator('[aria-label="Love"]:not(.text-red-500)')).toBeVisible();
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should work on mobile
    await page.click('text=Recipes');
    await expect(page.locator('text=No recipes found')).toBeVisible();
    
    // Floating tools should be accessible
    await expect(page.locator('[data-testid="floating-tools-menu"]')).toBeVisible();
    
    // Tools should open properly on mobile
    await page.click('[data-testid="floating-tools-button"]');
    await page.click('[data-testid="converter-tool"]');
    
    // Dialog should be responsive
    await expect(page.locator('text=Measurement Converter')).toBeVisible();
    
    // Should be able to close
    await page.press('Escape');
  });

  test('should persist data across sessions', async ({ page }) => {
    // Create a recipe
    await page.click('text=Recipes');
    await page.click('text=Add Recipe');
    
    await page.fill('[placeholder*="recipe title"]', 'Persistence Test');
    await page.fill('[placeholder*="author"]', 'Persist Chef');
    await page.fill('[placeholder*="time"]', '25');
    await page.fill('[placeholder*="servings"]', '3');
    
    await page.fill('[placeholder*="ingredient name"]', 'memory');
    await page.click('text=Add Ingredient');
    
    await page.fill('[placeholder*="step description"]', 'Remember this');
    await page.click('text=Add Step');
    
    await page.click('text=Save Recipe');
    
    // Reload the page (simulating closing and reopening the app)
    await page.reload();
    
    // Data should persist
    await page.click('text=Recipes');
    await expect(page.locator('text=Persistence Test')).toBeVisible();
    
    // Check details are maintained
    await page.click('text=Persistence Test');
    await expect(page.locator('text=by Persist Chef')).toBeVisible();
    await expect(page.locator('text=25 minutes')).toBeVisible();
    await expect(page.locator('text=memory')).toBeVisible();
    await expect(page.locator('text=Remember this')).toBeVisible();
  });
}); 