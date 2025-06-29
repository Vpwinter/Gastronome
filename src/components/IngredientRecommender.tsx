'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getRecipeRecommendations, getIngredientSuggestions } from '@/lib/recipe-recommender';
import { RecipeRecommendation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Plus, X, Star, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export default function IngredientRecommender() {
  const { recipes, globalRecipes, setCurrentView } = useAppStore();
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recommendations, setRecommendations] = useState<RecipeRecommendation[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0.1);
  const [preferQuick, setPreferQuick] = useState(false);
  const [preferSimple, setPreferSimple] = useState(true);

  // All available recipes (user + global) - memoized to prevent infinite re-renders
  const allRecipes = useMemo(() => [...recipes, ...globalRecipes], [recipes, globalRecipes]);

  // Update recommendations when ingredients change
  useEffect(() => {
    if (availableIngredients.length > 0) {
      setIsLoading(true);
      const newRecommendations = getRecipeRecommendations(
        availableIngredients,
        allRecipes,
        {
          minMatchScore,
          maxResults: 15,
          preferFewerIngredients: preferSimple,
          preferQuickRecipes: preferQuick,
        }
      );
      setRecommendations(newRecommendations);
      setIsLoading(false);
    } else {
      setRecommendations([]);
    }
  }, [availableIngredients, minMatchScore, preferQuick, preferSimple, allRecipes]);

  // Update ingredient suggestions
  useEffect(() => {
    if (availableIngredients.length > 0) {
      const newSuggestions = getIngredientSuggestions(availableIngredients);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [availableIngredients]);

  const addIngredient = () => {
    const ingredient = currentIngredient.trim();
    if (ingredient && !availableIngredients.includes(ingredient.toLowerCase())) {
      setAvailableIngredients([...availableIngredients, ingredient.toLowerCase()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setAvailableIngredients(availableIngredients.filter(ing => ing !== ingredient));
  };

  const addSuggestedIngredient = (ingredient: string) => {
    if (!availableIngredients.includes(ingredient.toLowerCase())) {
      setAvailableIngredients([...availableIngredients, ingredient.toLowerCase()]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 0.8) return 'Excellent Match';
    if (score >= 0.6) return 'Good Match';
    if (score >= 0.4) return 'Partial Match';
    return 'Few Ingredients';
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
          <ChefHat className="h-6 w-6" />
          Ingredient Recommender
        </div>
        <p className="text-muted-foreground">
          Tell us what ingredients you have, and we&apos;ll suggest recipes you can make!
        </p>
      </div>

      {/* Ingredient Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Ingredients</CardTitle>
          <CardDescription>
            Add ingredients you currently have in your kitchen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input field */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter an ingredient (e.g., chicken, tomatoes, onion)"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={addIngredient} disabled={!currentIngredient.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Current ingredients */}
          {availableIngredients.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Your Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {availableIngredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="secondary"
                    className="flex items-center gap-1 capitalize"
                  >
                    {ingredient}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeIngredient(ingredient)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Ingredient suggestions */}
          {suggestions.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Suggested Additions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent capitalize"
                    onClick={() => addSuggestedIngredient(suggestion)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      {availableIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Minimum Match</label>
                <select
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value={0.05}>Any Match (5%)</option>
                  <option value={0.1}>Minimal Match (10%)</option>
                  <option value={0.2}>Decent Match (20%)</option>
                  <option value={0.3}>Fair Match (30%)</option>
                  <option value={0.5}>Good Match (50%)</option>
                  <option value={0.7}>Great Match (70%)</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preferSimple"
                  checked={preferSimple}
                  onChange={(e) => setPreferSimple(e.target.checked)}
                />
                <label htmlFor="preferSimple" className="text-sm">
                  Prefer Simple Recipes
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preferQuick"
                  checked={preferQuick}
                  onChange={(e) => setPreferQuick(e.target.checked)}
                />
                <label htmlFor="preferQuick" className="text-sm">
                  Prefer Quick Recipes
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {availableIngredients.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recipe Recommendations ({recommendations.length})
            </h2>
            {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          </div>

          {recommendations.length === 0 && !isLoading && (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No matching recipes found</p>
                <p className="text-muted-foreground">
                  Try adding more ingredients or lowering the match threshold
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.recipe.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  // Navigate to recipe detail or recipes view
                  setCurrentView('recipes');
                }}
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">
                      {rec.recipe.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${getMatchScoreColor(rec.matchScore)}`}
                    >
                      {Math.round(rec.matchScore * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by {rec.recipe.author}
                  </p>
                  <p className={`text-xs font-medium ${getMatchScoreColor(rec.matchScore)}`}>
                    {getMatchScoreText(rec.matchScore)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Recipe stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {rec.recipe.timeMinutes}m
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {rec.recipe.servings}
                    </div>
                    {rec.recipe.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        {rec.recipe.rating}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Available ingredients */}
                  {rec.availableIngredients.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        You Have ({rec.availableIngredients.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rec.availableIngredients.slice(0, 4).map((ingredient) => (
                          <Badge key={ingredient} variant="outline" className="text-xs capitalize">
                            {ingredient}
                          </Badge>
                        ))}
                        {rec.availableIngredients.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{rec.availableIngredients.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Missing ingredients */}
                  {rec.missingIngredients.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-orange-600 mb-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Need to Buy ({rec.missingIngredients.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {rec.missingIngredients.slice(0, 3).map((ingredient) => (
                          <Badge key={ingredient} variant="secondary" className="text-xs capitalize">
                            {ingredient}
                          </Badge>
                        ))}
                        {rec.missingIngredients.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{rec.missingIngredients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Getting started hint */}
      {availableIngredients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Ready to discover recipes?</p>
            <p className="text-muted-foreground mb-4">
              Start by adding ingredients you have available in your kitchen
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['chicken', 'tomatoes', 'onion', 'pasta', 'rice', 'eggs'].map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => addSuggestedIngredient(ingredient)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {ingredient}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 