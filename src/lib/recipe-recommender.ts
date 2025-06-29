import { Recipe, RecipeRecommendation } from '@/types';

// Fuzzy string matching for ingredient names
function fuzzyMatch(ingredient1: string, ingredient2: string): number {
  const str1 = ingredient1.toLowerCase().trim();
  const str2 = ingredient2.toLowerCase().trim();
  
  // Exact match
  if (str1 === str2) return 1.0;
  
  // Check if one contains the other
  if (str1.includes(str2) || str2.includes(str1)) return 0.8;
  
  // Check for word overlap
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  let matchingWords = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
        matchingWords++;
        break;
      }
    }
  }
  
  const wordMatchRatio = Math.max(matchingWords / words1.length, matchingWords / words2.length);
  
  // Basic Levenshtein distance for character similarity
  const maxLen = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);
  const charSimilarity = 1 - (distance / maxLen);
  
  // Combine word and character similarity
  return Math.max(wordMatchRatio * 0.7 + charSimilarity * 0.3, 0);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Match available ingredients with recipe ingredients
function matchIngredients(availableIngredients: string[], recipeIngredients: string[]): {
  matchedIngredients: string[];
  unmatchedIngredients: string[];
  availableIngredients: string[];
  matchScore: number;
} {
  const matched: string[] = [];
  const unmatched: string[] = [];
  const available: string[] = [];
  
  const usedAvailable = new Set<number>();
  
  // Try to match each recipe ingredient with available ingredients
  for (const recipeIngredient of recipeIngredients) {
    let bestMatch = -1;
    let bestScore = 0;
    
    for (let i = 0; i < availableIngredients.length; i++) {
      if (usedAvailable.has(i)) continue;
      
      const score = fuzzyMatch(recipeIngredient, availableIngredients[i]);
      if (score > bestScore && score >= 0.6) { // Minimum threshold for match
        bestScore = score;
        bestMatch = i;
      }
    }
    
    if (bestMatch >= 0) {
      matched.push(recipeIngredient);
      available.push(availableIngredients[bestMatch]);
      usedAvailable.add(bestMatch);
    } else {
      unmatched.push(recipeIngredient);
    }
  }
  
  // Calculate match score based on ingredient importance
  const totalIngredients = recipeIngredients.length;
  const matchedCount = matched.length;
  
  // Basic match ratio
  let matchScore = matchedCount / totalIngredients;
  
  // Bonus for recipes with fewer total ingredients (easier to make)
  if (totalIngredients <= 5) matchScore *= 1.1;
  else if (totalIngredients <= 10) matchScore *= 1.05;
  
  // Penalty for many missing ingredients
  const missingCount = unmatched.length;
  if (missingCount > 5) matchScore *= 0.8;
  else if (missingCount > 3) matchScore *= 0.9;
  
  return {
    matchedIngredients: matched,
    unmatchedIngredients: unmatched,
    availableIngredients: available,
    matchScore: Math.min(matchScore, 1.0)
  };
}

// Main function to get recipe recommendations
export function getRecipeRecommendations(
  availableIngredients: string[],
  recipes: Recipe[],
  options: {
    minMatchScore?: number;
    maxResults?: number;
    preferFewerIngredients?: boolean;
    preferQuickRecipes?: boolean;
  } = {}
): RecipeRecommendation[] {
  const {
    minMatchScore = 0.3,
    maxResults = 20,
    preferFewerIngredients = true,
    preferQuickRecipes = false
  } = options;
  
  if (availableIngredients.length === 0) {
    return [];
  }
  
  // Clean and normalize available ingredients
  const cleanAvailableIngredients = availableIngredients
    .map(ing => ing.trim().toLowerCase())
    .filter(ing => ing.length > 0);
  
  const recommendations: RecipeRecommendation[] = [];
  
  for (const recipe of recipes) {
    // Extract ingredient names from recipe
    const recipeIngredientNames = recipe.ingredients.map(ing => ing.name.toLowerCase());
    
    // Skip if recipe has no ingredients
    if (recipeIngredientNames.length === 0) continue;
    
    const matchResult = matchIngredients(cleanAvailableIngredients, recipeIngredientNames);
    
    // Skip if match score is too low
    if (matchResult.matchScore < minMatchScore) continue;
    
    let finalScore = matchResult.matchScore;
    
    // Apply preferences
    if (preferFewerIngredients) {
      const ingredientCount = recipe.ingredients.length;
      if (ingredientCount <= 5) finalScore *= 1.2;
      else if (ingredientCount <= 8) finalScore *= 1.1;
      else if (ingredientCount > 15) finalScore *= 0.9;
    }
    
    if (preferQuickRecipes) {
      if (recipe.timeMinutes <= 15) finalScore *= 1.3;
      else if (recipe.timeMinutes <= 30) finalScore *= 1.2;
      else if (recipe.timeMinutes <= 45) finalScore *= 1.1;
      else if (recipe.timeMinutes > 120) finalScore *= 0.8;
    }
    
    // Boost highly rated recipes
    if (recipe.rating >= 4) finalScore *= 1.1;
    else if (recipe.rating >= 3) finalScore *= 1.05;
    
    // Boost loved recipes
    if (recipe.loved) finalScore *= 1.1;
    
    recommendations.push({
      recipe,
      matchScore: Math.min(finalScore, 1.0),
      missingIngredients: matchResult.unmatchedIngredients,
      availableIngredients: matchResult.availableIngredients
    });
  }
  
  // Sort by match score (descending) and limit results
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);
}

// Helper function to get ingredient suggestions based on popular combinations
export function getIngredientSuggestions(currentIngredients: string[]): string[] {
  const suggestions: string[] = [];
  const currentLower = currentIngredients.map(ing => ing.toLowerCase());
  
  // Common ingredient combinations
  const combinations: Record<string, string[]> = {
    'tomato': ['onion', 'garlic', 'basil', 'olive oil', 'mozzarella'],
    'onion': ['garlic', 'tomato', 'bell pepper', 'celery'],
    'garlic': ['onion', 'olive oil', 'tomato', 'herbs'],
    'chicken': ['onion', 'garlic', 'herbs', 'lemon', 'olive oil'],
    'pasta': ['tomato', 'garlic', 'olive oil', 'parmesan', 'basil'],
    'rice': ['onion', 'garlic', 'broth', 'vegetables'],
    'egg': ['butter', 'milk', 'cheese', 'herbs'],
    'flour': ['butter', 'sugar', 'egg', 'baking powder'],
    'beef': ['onion', 'garlic', 'herbs', 'wine', 'vegetables'],
    'fish': ['lemon', 'herbs', 'olive oil', 'garlic'],
  };
  
  // Find suggestions based on current ingredients
  for (const ingredient of currentLower) {
    for (const [key, values] of Object.entries(combinations)) {
      if (ingredient.includes(key) || key.includes(ingredient)) {
        for (const suggestion of values) {
          if (!currentLower.some(current => 
            current.includes(suggestion) || suggestion.includes(current)
          )) {
            suggestions.push(suggestion);
          }
        }
      }
    }
  }
  
  // Remove duplicates and return top suggestions
  return [...new Set(suggestions)].slice(0, 10);
}

// Function to analyze recipes and find the most common ingredient combinations
export function analyzeIngredientPatterns(recipes: Recipe[]): Record<string, string[]> {
  const patterns: Record<string, Set<string>> = {};
  
  for (const recipe of recipes) {
    const ingredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
    
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      if (!patterns[ingredient]) {
        patterns[ingredient] = new Set();
      }
      
      // Add all other ingredients as potential combinations
      for (let j = 0; j < ingredients.length; j++) {
        if (i !== j) {
          patterns[ingredient].add(ingredients[j]);
        }
      }
    }
  }
  
  // Convert sets to arrays and sort by frequency
  const result: Record<string, string[]> = {};
  for (const [ingredient, combinations] of Object.entries(patterns)) {
    result[ingredient] = Array.from(combinations);
  }
  
  return result;
} 