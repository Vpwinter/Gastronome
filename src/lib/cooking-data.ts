import { IngredientSubstitution, MeasurementConversion } from '@/types';

// Common ingredient substitutions database
export const INGREDIENT_SUBSTITUTIONS: IngredientSubstitution[] = [
  // Dairy substitutions
  { original: 'butter', substitute: 'margarine', ratio: 1.0, context: 'both' },
  { original: 'butter', substitute: 'coconut oil', ratio: 0.75, context: 'baking', notes: 'Use solid coconut oil' },
  { original: 'butter', substitute: 'olive oil', ratio: 0.75, context: 'cooking' },
  { original: 'milk', substitute: 'almond milk', ratio: 1.0, context: 'both' },
  { original: 'milk', substitute: 'oat milk', ratio: 1.0, context: 'both' },
  { original: 'milk', substitute: 'coconut milk', ratio: 1.0, context: 'both' },
  { original: 'heavy cream', substitute: 'coconut cream', ratio: 1.0, context: 'both' },
  { original: 'sour cream', substitute: 'greek yogurt', ratio: 1.0, context: 'both' },
  { original: 'cream cheese', substitute: 'cashew cream', ratio: 1.0, context: 'both' },
  
  // Egg substitutions
  { original: 'egg', substitute: 'flax egg', ratio: 1.0, context: 'baking', notes: '1 tbsp ground flaxseed + 3 tbsp water' },
  { original: 'egg', substitute: 'chia egg', ratio: 1.0, context: 'baking', notes: '1 tbsp chia seeds + 3 tbsp water' },
  { original: 'egg', substitute: 'applesauce', ratio: 0.25, context: 'baking', notes: '1/4 cup per egg' },
  { original: 'egg', substitute: 'mashed banana', ratio: 0.25, context: 'baking', notes: '1/4 cup per egg' },
  
  // Flour substitutions
  { original: 'all-purpose flour', substitute: 'almond flour', ratio: 0.25, context: 'baking', notes: 'Use 1/4 the amount, add binding agent' },
  { original: 'all-purpose flour', substitute: 'coconut flour', ratio: 0.25, context: 'baking', notes: 'Use 1/4 the amount, very absorbent' },
  { original: 'all-purpose flour', substitute: 'oat flour', ratio: 1.3, context: 'baking', notes: 'Use 1.3x the amount' },
  { original: 'cake flour', substitute: 'all-purpose flour', ratio: 1.0, context: 'baking', notes: 'Remove 2 tbsp per cup and add 2 tbsp cornstarch' },
  
  // Sugar substitutions
  { original: 'white sugar', substitute: 'coconut sugar', ratio: 1.0, context: 'both' },
  { original: 'white sugar', substitute: 'maple syrup', ratio: 0.75, context: 'both', notes: 'Reduce liquid by 1/4 cup' },
  { original: 'white sugar', substitute: 'honey', ratio: 0.75, context: 'both', notes: 'Reduce liquid by 1/4 cup' },
  { original: 'brown sugar', substitute: 'coconut sugar', ratio: 1.0, context: 'both' },
  
  // Baking agents
  { original: 'baking powder', substitute: 'baking soda + cream of tartar', ratio: 1.0, context: 'baking', notes: '1/4 tsp baking soda + 1/2 tsp cream of tartar per 1 tsp baking powder' },
  { original: 'vanilla extract', substitute: 'vanilla bean paste', ratio: 1.0, context: 'baking' },
  { original: 'vanilla extract', substitute: 'almond extract', ratio: 0.5, context: 'baking' },
  
  // Herbs and spices
  { original: 'fresh herbs', substitute: 'dried herbs', ratio: 0.33, context: 'cooking', notes: '1/3 the amount of dried' },
  { original: 'garlic clove', substitute: 'garlic powder', ratio: 0.125, context: 'cooking', notes: '1/8 tsp per clove' },
  { original: 'onion', substitute: 'onion powder', ratio: 0.25, context: 'cooking', notes: '1 tbsp per medium onion' },
  
  // Vinegars and acids
  { original: 'lemon juice', substitute: 'lime juice', ratio: 1.0, context: 'both' },
  { original: 'lemon juice', substitute: 'white vinegar', ratio: 1.0, context: 'cooking' },
  { original: 'balsamic vinegar', substitute: 'red wine vinegar + sugar', ratio: 1.0, context: 'cooking', notes: 'Add pinch of sugar' },
  
  // Cooking oils
  { original: 'vegetable oil', substitute: 'canola oil', ratio: 1.0, context: 'both' },
  { original: 'vegetable oil', substitute: 'olive oil', ratio: 1.0, context: 'cooking' },
  { original: 'sesame oil', substitute: 'olive oil + sesame seeds', ratio: 1.0, context: 'cooking', notes: 'Toast sesame seeds for flavor' },
];

// Measurement conversion database
export const MEASUREMENT_CONVERSIONS: MeasurementConversion[] = [
  // Volume conversions - Metric
  { from: 'ml', to: 'l', ratio: 0.001, type: 'volume' },
  { from: 'l', to: 'ml', ratio: 1000, type: 'volume' },
  { from: 'cl', to: 'ml', ratio: 10, type: 'volume' },
  { from: 'dl', to: 'ml', ratio: 100, type: 'volume' },
  
  // Volume conversions - Imperial/US
  { from: 'tsp', to: 'tbsp', ratio: 0.333, type: 'volume' },
  { from: 'tbsp', to: 'tsp', ratio: 3, type: 'volume' },
  { from: 'tbsp', to: 'fl oz', ratio: 0.5, type: 'volume' },
  { from: 'fl oz', to: 'tbsp', ratio: 2, type: 'volume' },
  { from: 'fl oz', to: 'cup', ratio: 0.125, type: 'volume' },
  { from: 'cup', to: 'fl oz', ratio: 8, type: 'volume' },
  { from: 'cup', to: 'pint', ratio: 0.5, type: 'volume' },
  { from: 'pint', to: 'cup', ratio: 2, type: 'volume' },
  { from: 'pint', to: 'quart', ratio: 0.5, type: 'volume' },
  { from: 'quart', to: 'pint', ratio: 2, type: 'volume' },
  { from: 'quart', to: 'gallon', ratio: 0.25, type: 'volume' },
  { from: 'gallon', to: 'quart', ratio: 4, type: 'volume' },
  
  // Volume conversions - Metric to Imperial
  { from: 'ml', to: 'tsp', ratio: 0.202884, type: 'volume' },
  { from: 'ml', to: 'tbsp', ratio: 0.067628, type: 'volume' },
  { from: 'ml', to: 'fl oz', ratio: 0.033814, type: 'volume' },
  { from: 'ml', to: 'cup', ratio: 0.004227, type: 'volume' },
  { from: 'l', to: 'cup', ratio: 4.227, type: 'volume' },
  { from: 'l', to: 'pint', ratio: 2.113, type: 'volume' },
  { from: 'l', to: 'quart', ratio: 1.057, type: 'volume' },
  { from: 'l', to: 'gallon', ratio: 0.264, type: 'volume' },
  
  // Volume conversions - Imperial to Metric
  { from: 'tsp', to: 'ml', ratio: 4.929, type: 'volume' },
  { from: 'tbsp', to: 'ml', ratio: 14.787, type: 'volume' },
  { from: 'fl oz', to: 'ml', ratio: 29.574, type: 'volume' },
  { from: 'cup', to: 'ml', ratio: 236.588, type: 'volume' },
  { from: 'cup', to: 'l', ratio: 0.237, type: 'volume' },
  { from: 'pint', to: 'l', ratio: 0.473, type: 'volume' },
  { from: 'quart', to: 'l', ratio: 0.946, type: 'volume' },
  { from: 'gallon', to: 'l', ratio: 3.785, type: 'volume' },
  
  // Weight conversions - Metric
  { from: 'mg', to: 'g', ratio: 0.001, type: 'weight' },
  { from: 'g', to: 'mg', ratio: 1000, type: 'weight' },
  { from: 'g', to: 'kg', ratio: 0.001, type: 'weight' },
  { from: 'kg', to: 'g', ratio: 1000, type: 'weight' },
  
  // Weight conversions - Imperial
  { from: 'oz', to: 'lb', ratio: 0.0625, type: 'weight' },
  { from: 'lb', to: 'oz', ratio: 16, type: 'weight' },
  { from: 'lb', to: 'stone', ratio: 0.071, type: 'weight' },
  { from: 'stone', to: 'lb', ratio: 14, type: 'weight' },
  
  // Weight conversions - Metric to Imperial
  { from: 'g', to: 'oz', ratio: 0.035274, type: 'weight' },
  { from: 'kg', to: 'lb', ratio: 2.205, type: 'weight' },
  { from: 'kg', to: 'oz', ratio: 35.274, type: 'weight' },
  
  // Weight conversions - Imperial to Metric
  { from: 'oz', to: 'g', ratio: 28.35, type: 'weight' },
  { from: 'lb', to: 'kg', ratio: 0.454, type: 'weight' },
  { from: 'lb', to: 'g', ratio: 453.592, type: 'weight' },
  
  // Temperature conversions
  { from: '°F', to: '°C', ratio: 1, type: 'temperature' }, // Special case: (F-32) * 5/9
  { from: '°C', to: '°F', ratio: 1, type: 'temperature' }, // Special case: C * 9/5 + 32
  
  // Length conversions
  { from: 'mm', to: 'cm', ratio: 0.1, type: 'length' },
  { from: 'cm', to: 'mm', ratio: 10, type: 'length' },
  { from: 'cm', to: 'inch', ratio: 0.394, type: 'length' },
  { from: 'inch', to: 'cm', ratio: 2.54, type: 'length' },
  { from: 'inch', to: 'inches', ratio: 1, type: 'length' },
];

// Common cooking ingredient density for volume-to-weight conversions
export const INGREDIENT_DENSITIES: Record<string, number> = {
  // Density in grams per cup
  'flour': 120,
  'all-purpose flour': 120,
  'bread flour': 120,
  'cake flour': 100,
  'sugar': 200,
  'white sugar': 200,
  'brown sugar': 213,
  'powdered sugar': 120,
  'butter': 227,
  'olive oil': 216,
  'vegetable oil': 220,
  'honey': 340,
  'maple syrup': 322,
  'milk': 245,
  'water': 240,
  'rice': 185,
  'oats': 90,
  'breadcrumbs': 108,
  'cocoa powder': 75,
  'baking powder': 192,
  'baking soda': 220,
  'salt': 300,
  'vanilla extract': 208,
};

// Helper functions for conversions
export function convertMeasurement(amount: number, from: string, to: string): number | null {
  // Handle temperature conversions specially
  if (from === '°F' && to === '°C') {
    return (amount - 32) * 5 / 9;
  }
  if (from === '°C' && to === '°F') {
    return amount * 9 / 5 + 32;
  }
  
  // Find direct conversion
  const directConversion = MEASUREMENT_CONVERSIONS.find(
    conv => conv.from === from && conv.to === to
  );
  
  if (directConversion) {
    return amount * directConversion.ratio;
  }
  
  // Try reverse conversion
  const reverseConversion = MEASUREMENT_CONVERSIONS.find(
    conv => conv.from === to && conv.to === from
  );
  
  if (reverseConversion) {
    return amount / reverseConversion.ratio;
  }
  
  return null; // No conversion found
}

export function findSubstitutions(ingredient: string): IngredientSubstitution[] {
  const lowerIngredient = ingredient.toLowerCase();
  return INGREDIENT_SUBSTITUTIONS.filter(sub => 
    sub.original.toLowerCase().includes(lowerIngredient) ||
    lowerIngredient.includes(sub.original.toLowerCase())
  );
}

export function getIngredientDensity(ingredient: string): number | null {
  const lowerIngredient = ingredient.toLowerCase();
  
  // Try exact match first
  if (INGREDIENT_DENSITIES[lowerIngredient]) {
    return INGREDIENT_DENSITIES[lowerIngredient];
  }
  
  // Try partial matches
  for (const [key, density] of Object.entries(INGREDIENT_DENSITIES)) {
    if (lowerIngredient.includes(key) || key.includes(lowerIngredient)) {
      return density;
    }
  }
  
  return null;
} 