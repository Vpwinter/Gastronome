import { describe, it, expect } from 'vitest';
import { 
  findSubstitutions, 
  convertMeasurement, 
  getIngredientDensity,
  INGREDIENT_SUBSTITUTIONS,
  MEASUREMENT_CONVERSIONS 
} from '../cooking-data';

describe('Cooking Data Library', () => {
  describe('findSubstitutions', () => {
    it('should find exact substitutions for common ingredients', () => {
      const substitutions = findSubstitutions('butter');
      
      expect(substitutions.length).toBeGreaterThan(0);
      expect(substitutions.some(sub => sub.substitute === 'margarine')).toBe(true);
    });

    it('should find substitutions with case insensitive search', () => {
      const upperCase = findSubstitutions('BUTTER');
      const lowerCase = findSubstitutions('butter');
      const mixedCase = findSubstitutions('BuTtEr');
      
      expect(upperCase.length).toBe(lowerCase.length);
      expect(mixedCase.length).toBe(lowerCase.length);
    });

    it('should find partial matches for ingredient names', () => {
      const substitutions = findSubstitutions('all-purpose flour');
      
      expect(substitutions.length).toBeGreaterThan(0);
      // Should find flour substitutions
      expect(substitutions.some(sub => sub.original.includes('flour'))).toBe(true);
    });

    it('should include context information in results', () => {
      const substitutions = findSubstitutions('flour');
      
      expect(substitutions.length).toBeGreaterThan(0);
      
      // Should have context information
      const contextSubs = substitutions.filter(sub => sub.context);
      expect(contextSubs.length).toBeGreaterThan(0);
      
      // Context should be valid values
      contextSubs.forEach(sub => {
        expect(['baking', 'cooking', 'both']).toContain(sub.context);
      });
    });

    it('should return empty array for unknown ingredients', () => {
      const substitutions = findSubstitutions('extremely-rare-unknown-ingredient');
      expect(substitutions).toHaveLength(0);
    });

    it('should return substitutions sorted by relevance (exact matches first)', () => {
      const substitutions = findSubstitutions('milk');
      
      if (substitutions.length > 1) {
        // First result should be exact match for 'milk'
        expect(substitutions[0].original.toLowerCase()).toBe('milk');
      }
    });

    it('should include proper ratios and notes', () => {
      const substitutions = findSubstitutions('butter');
      
      substitutions.forEach(sub => {
        expect(sub.ratio).toBeGreaterThan(0);
        expect(typeof sub.substitute).toBe('string');
        expect(sub.substitute.length).toBeGreaterThan(0);
      });
    });
  });

  describe('convertMeasurement', () => {
    it('should convert basic volume measurements', () => {
      // 1 cup = 16 tablespoons
      const result = convertMeasurement(1, 'cup', 'tbsp');
      expect(result).toBeCloseTo(16, 1);
      
      // 1 tablespoon = 3 teaspoons  
      const tspResult = convertMeasurement(1, 'tbsp', 'tsp');
      expect(tspResult).toBeCloseTo(3, 1);
    });

    it('should convert metric volume measurements', () => {
      // 1 liter = 1000 ml
      const result = convertMeasurement(1, 'l', 'ml');
      expect(result).toBeCloseTo(1000, 1);
      
      // 1 deciliter = 100 ml
      const dlResult = convertMeasurement(1, 'dl', 'ml');
      expect(dlResult).toBeCloseTo(100, 1);
    });

    it('should convert weight measurements', () => {
      // 1 kg = 1000 g
      const result = convertMeasurement(1, 'kg', 'g');
      expect(result).toBeCloseTo(1000, 1);
      
      // 1 lb ≈ 453.6 g
      const lbResult = convertMeasurement(1, 'lb', 'g');
      expect(lbResult).toBeCloseTo(453.6, 1);
    });

    it('should convert temperature measurements', () => {
      // 0°C = 32°F
      const freezing = convertMeasurement(0, '°C', '°F');
      expect(freezing).toBeCloseTo(32, 1);
      
      // 100°C = 212°F
      const boiling = convertMeasurement(100, '°C', '°F');
      expect(boiling).toBeCloseTo(212, 1);
    });

    it('should handle same unit conversions', () => {
      const result = convertMeasurement(5, 'cup', 'cup');
      expect(result).toBe(5);
    });

    it('should return null for incompatible unit types', () => {
      // Can't convert volume to weight without density
      const result = convertMeasurement(1, 'cup', 'g');
      expect(result).toBeNull();
      
      // Can't convert temperature to volume
      const tempResult = convertMeasurement(100, '°C', 'ml');
      expect(tempResult).toBeNull();
    });

    it('should handle decimal inputs correctly', () => {
      const result = convertMeasurement(0.5, 'cup', 'tbsp');
      expect(result).toBeCloseTo(8, 1); // Half cup = 8 tablespoons
    });

    it('should handle zero and negative inputs', () => {
      const zeroResult = convertMeasurement(0, 'cup', 'ml');
      expect(zeroResult).toBe(0);
      
      const negativeResult = convertMeasurement(-1, 'tsp', 'ml');
      expect(negativeResult).toBeCloseTo(-4.93, 1); // Should still convert
    });
  });

  describe('getIngredientDensity', () => {
    it('should return density for common ingredients', () => {
      const flourDensity = getIngredientDensity('flour');
      expect(flourDensity).toBeGreaterThan(0);
      expect(typeof flourDensity).toBe('number');
      
      const sugarDensity = getIngredientDensity('sugar');
      expect(sugarDensity).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const lower = getIngredientDensity('flour');
      const upper = getIngredientDensity('FLOUR');
      const mixed = getIngredientDensity('FlOuR');
      
      expect(lower).toBe(upper);
      expect(mixed).toBe(upper);
    });

    it('should find partial matches', () => {
      const density = getIngredientDensity('all-purpose flour');
      expect(density).toBeGreaterThan(0);
      
      const whiteSugar = getIngredientDensity('white sugar');
      expect(whiteSugar).toBeGreaterThan(0);
    });

    it('should return null for unknown ingredients', () => {
      const density = getIngredientDensity('unknown-exotic-ingredient');
      expect(density).toBeNull();
    });

    it('should return reasonable density values', () => {
      // Densities should be reasonable (between 0.1 and 10 g/ml typically)
      const flour = getIngredientDensity('flour');
      const butter = getIngredientDensity('butter');
      
      if (flour) expect(flour).toBeGreaterThan(0.1);
      if (flour) expect(flour).toBeLessThan(2);
      
      if (butter) expect(butter).toBeGreaterThan(0.5);
      if (butter) expect(butter).toBeLessThan(2);
    });
  });

  describe('Data Integrity', () => {
    it('should have valid substitution data structure', () => {
      INGREDIENT_SUBSTITUTIONS.forEach(sub => {
        expect(typeof sub.original).toBe('string');
        expect(sub.original.length).toBeGreaterThan(0);
        expect(typeof sub.substitute).toBe('string');
        expect(sub.substitute.length).toBeGreaterThan(0);
        expect(typeof sub.ratio).toBe('number');
        expect(sub.ratio).toBeGreaterThan(0);
        
        if (sub.context) {
          expect(['baking', 'cooking', 'both']).toContain(sub.context);
        }
      });
    });

    it('should have valid conversion data structure', () => {
      MEASUREMENT_CONVERSIONS.forEach(conv => {
        expect(typeof conv.from).toBe('string');
        expect(conv.from.length).toBeGreaterThan(0);
        expect(typeof conv.to).toBe('string');
        expect(conv.to.length).toBeGreaterThan(0);
        expect(typeof conv.ratio).toBe('number');
        expect(conv.ratio).toBeGreaterThan(0);
        expect(['volume', 'weight', 'temperature', 'length']).toContain(conv.type);
      });
    });

    it('should have bidirectional conversions where appropriate', () => {
      // For most unit conversions, there should be a reverse conversion
      const volumeConversions = MEASUREMENT_CONVERSIONS.filter(c => c.type === 'volume');
      
      volumeConversions.forEach(conv => {
        // Skip temperature conversions as they have complex formulas
        if (conv.type === 'temperature') return;
        
        const reverse = volumeConversions.find(
          c => c.from === conv.to && c.to === conv.from
        );
        
        if (reverse) {
          // Ratios should be reciprocals (approximately)
          expect(conv.ratio * reverse.ratio).toBeCloseTo(1, 2);
        }
      });
    });

    it('should have no duplicate substitutions', () => {
      const seen = new Set();
      
      INGREDIENT_SUBSTITUTIONS.forEach(sub => {
        const key = `${sub.original}-${sub.substitute}-${sub.context || 'default'}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      });
    });

    it('should have reasonable substitution ratios', () => {
      INGREDIENT_SUBSTITUTIONS.forEach(sub => {
        // Most substitutions should be between 0.1x and 10x
        expect(sub.ratio).toBeGreaterThan(0.05);
        expect(sub.ratio).toBeLessThan(20);
      });
    });
  });
}); 