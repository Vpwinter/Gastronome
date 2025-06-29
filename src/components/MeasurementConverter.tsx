'use client';

import { useState, useMemo } from 'react';
import { convertMeasurement, getIngredientDensity, MEASUREMENT_CONVERSIONS } from '@/lib/cooking-data';
import { COOKING_MEASURES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, ArrowRightLeft, Thermometer, Scale, Ruler, Droplets, Lightbulb } from 'lucide-react';

export default function MeasurementConverter() {
  const [amount, setAmount] = useState('');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [ingredient, setIngredient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'volume' | 'weight' | 'temperature' | 'length'>('all');

  // Categorize measurements
  const measurementCategories = useMemo(() => {
    const categories = {
      volume: {
        icon: <Droplets className="h-4 w-4" />,
        measures: ['ml', 'l', 'dl', 'cl', 'tsp', 'tbsp', 'fl oz', 'cup', 'pint', 'quart', 'gallon']
      },
      weight: {
        icon: <Scale className="h-4 w-4" />,
        measures: ['mg', 'g', 'kg', 'oz', 'lb', 'stone']
      },
      temperature: {
        icon: <Thermometer className="h-4 w-4" />,
        measures: ['°C', '°F']
      },
      length: {
        icon: <Ruler className="h-4 w-4" />,
        measures: ['mm', 'cm', 'inch', 'inches']
      },
      pieces: {
        icon: <Badge className="h-4 w-4" />,
        measures: ['piece', 'pieces', 'slice', 'slices', 'clove', 'cloves', 'dozen', 'half dozen', 'bunch', 'head', 'can', 'jar', 'bottle', 'packet', 'bag', 'box', 'tin']
      },
      special: {
        icon: <Lightbulb className="h-4 w-4" />,
        measures: ['pinch', 'dash', 'splash', 'handful', 'q.s.', 'to taste']
      }
    };
    
    return categories;
  }, []);

  // Filter measurements based on selected category
  const availableMeasurements = useMemo(() => {
    if (selectedCategory === 'all') {
      return COOKING_MEASURES;
    }
    
    const categoryMeasures = measurementCategories[selectedCategory as keyof typeof measurementCategories];
    return categoryMeasures ? categoryMeasures.measures : [];
  }, [selectedCategory, measurementCategories]);

  // Perform conversion
  const conversionResult = useMemo(() => {
    if (!amount || !fromUnit || !toUnit) return null;
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return null;
    
    const result = convertMeasurement(numericAmount, fromUnit, toUnit);
    if (result === null) return null;
    
    return {
      original: `${numericAmount} ${fromUnit}`,
      converted: `${result.toFixed(3).replace(/\.?0+$/, '')} ${toUnit}`,
      result: result
    };
  }, [amount, fromUnit, toUnit]);

  // Get ingredient-specific conversions if possible
  const ingredientConversion = useMemo(() => {
    if (!ingredient || !conversionResult) return null;
    
    const density = getIngredientDensity(ingredient);
    if (!density) return null;
    
    // Only show if converting between volume and weight
    const volumeUnits = ['ml', 'l', 'tsp', 'tbsp', 'fl oz', 'cup'];
    const weightUnits = ['g', 'kg', 'oz', 'lb'];
    
    const fromIsVolume = volumeUnits.includes(fromUnit);
    const toIsWeight = weightUnits.includes(toUnit);
    const fromIsWeight = weightUnits.includes(fromUnit);
    const toIsVolume = volumeUnits.includes(toUnit);
    
    if (fromIsVolume && toIsWeight) {
      // Convert volume to weight using density
      const cupsAmount = convertMeasurement(parseFloat(amount), fromUnit, 'cup') || 0;
      const gramsAmount = cupsAmount * density;
      const finalAmount = convertMeasurement(gramsAmount, 'g', toUnit) || 0;
      
      return {
        type: 'volume-to-weight',
        result: `${finalAmount.toFixed(2)} ${toUnit}`,
        note: `Based on ${ingredient} density: ${density}g/cup`
      };
    }
    
    if (fromIsWeight && toIsVolume) {
      // Convert weight to volume using density
      const gramsAmount = convertMeasurement(parseFloat(amount), fromUnit, 'g') || 0;
      const cupsAmount = gramsAmount / density;
      const finalAmount = convertMeasurement(cupsAmount, 'cup', toUnit) || 0;
      
      return {
        type: 'weight-to-volume',
        result: `${finalAmount.toFixed(2)} ${toUnit}`,
        note: `Based on ${ingredient} density: ${density}g/cup`
      };
    }
    
    return null;
  }, [ingredient, conversionResult, amount, fromUnit, toUnit]);

  // Get related conversions
  const relatedConversions = useMemo(() => {
    if (!conversionResult) return [];
    
    const numericAmount = parseFloat(amount);
    const related = [];
    
    // Find conversions from the same category
    const getConversionsForCategory = (category: string) => {
      const categoryMeasures = measurementCategories[category as keyof typeof measurementCategories];
      if (!categoryMeasures) return [];
      
      return categoryMeasures.measures
        .filter(unit => unit !== fromUnit && unit !== toUnit)
        .map(unit => {
          const result = convertMeasurement(numericAmount, fromUnit, unit);
          if (result !== null) {
            return {
              unit,
              value: result.toFixed(3).replace(/\.?0+$/, ''),
              category
            };
          }
          return null;
        })
        .filter(Boolean);
    };
    
    // Add conversions from the same category as fromUnit
    for (const [category, data] of Object.entries(measurementCategories)) {
      if (data.measures.includes(fromUnit)) {
        related.push(...getConversionsForCategory(category));
      }
    }
    
    return related.slice(0, 6); // Limit to 6 related conversions
  }, [conversionResult, amount, fromUnit, toUnit, measurementCategories]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const clearAll = () => {
    setAmount('');
    setFromUnit('');
    setToUnit('');
    setIngredient('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-muted-foreground">
          Convert between different cooking measurements with precision and ease
        </p>
      </div>

      {/* Main Converter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Convert Measurements</CardTitle>
          <CardDescription>
            Enter an amount and select units to convert between different measurement systems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium self-center">Category:</span>
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {Object.entries(measurementCategories).map(([key, data]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key as any)}
                className="flex items-center gap-1"
              >
                {data.icon}
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>

          {/* Conversion Input */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableMeasurements.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={swapUnits}
                disabled={!fromUnit || !toUnit}
                className="flex items-center gap-1"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableMeasurements.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={clearAll} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </div>

          {/* Ingredient Input for Density Conversions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Ingredient (optional - for volume/weight conversions)
            </label>
            <Input
              placeholder="Enter ingredient name (e.g., flour, sugar, butter)"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
          </div>

          {/* Conversion Result */}
          {conversionResult && (
            <div className="space-y-4">
              <Separator />
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">
                  {conversionResult.converted}
                </div>
                <div className="text-sm text-muted-foreground">
                  {conversionResult.original} equals {conversionResult.converted}
                </div>
              </div>

              {/* Ingredient-specific conversion */}
              {ingredientConversion && (
                <div className="bg-accent/50 p-4 rounded-lg">
                  <div className="font-medium text-sm mb-1">
                    Ingredient-specific conversion:
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {ingredientConversion.result}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ingredientConversion.note}
                  </div>
                </div>
              )}

              {/* Related conversions */}
              {relatedConversions.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Related conversions:</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {relatedConversions.map((conv, index) => (
                      <Badge key={index} variant="outline" className="justify-between">
                        <span>{conv?.value} {conv?.unit}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Conversions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Droplets className="h-4 w-4" />
                Volume (US)
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>1 cup = 16 tbsp = 48 tsp</div>
                <div>1 pint = 2 cups</div>
                <div>1 quart = 2 pints = 4 cups</div>
                <div>1 gallon = 4 quarts</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Scale className="h-4 w-4" />
                Weight
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>1 lb = 16 oz</div>
                <div>1 kg = 1000 g</div>
                <div>1 oz = 28.35 g</div>
                <div>1 lb = 453.6 g</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                Temperature
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Water freezes: 32°F / 0°C</div>
                <div>Water boils: 212°F / 100°C</div>
                <div>Oven low: 225°F / 107°C</div>
                <div>Oven high: 450°F / 232°C</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Common Ratios</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>1 cup flour ≈ 120g</div>
                <div>1 cup sugar ≈ 200g</div>
                <div>1 cup butter ≈ 227g</div>
                <div>1 tbsp = 3 tsp</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 