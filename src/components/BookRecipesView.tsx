'use client';

import { useState, useEffect } from 'react';
import { Book, Recipe } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { RecipeCard } from './RecipeCard';
import { RecipeForm } from './RecipeForm';
import { RecipeDetailView } from './RecipeDetailView';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { StarRating } from './ui/star-rating';
import { ArrowLeft, Book as BookIcon, Heart } from 'lucide-react';

interface BookRecipesViewProps {
  book: Book;
  onBack: () => void;
}

export function BookRecipesView({ book, onBack }: BookRecipesViewProps) {
  const { recipes, globalRecipes, updateBook } = useAppStore();
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);

  // Get all recipes (both user and global) that belong to this book
  const allRecipes = [...recipes, ...globalRecipes];
  const bookRecipes = allRecipes.filter(recipe => book.recipeIds.includes(recipe.id));

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeForm(true);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setViewingRecipe(recipe);
  };

  const handleBackToBookRecipes = () => {
    setViewingRecipe(null);
  };

  const handleCloseForm = () => {
    setShowRecipeForm(false);
    setEditingRecipe(undefined);
  };

  const handleRatingChange = (newRating: number) => {
    if (!book.isGlobal) {
      updateBook(book.id, { rating: newRating });
    }
  };

  // Check if the currently viewed recipe still exists, if not, go back to book recipes list
  useEffect(() => {
    if (viewingRecipe) {
      const allRecipes = [...recipes, ...globalRecipes];
      const recipeStillExists = allRecipes.find(r => r.id === viewingRecipe.id);
      if (!recipeStillExists) {
        setViewingRecipe(null);
      }
    }
  }, [recipes, globalRecipes, viewingRecipe]);

  // If viewing a specific recipe, show the recipe detail view
  if (viewingRecipe) {
    return (
      <RecipeDetailView 
        recipe={viewingRecipe} 
        onBack={handleBackToBookRecipes} 
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Books</span>
        </Button>
      </div>

      {/* Book Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{book.title}</CardTitle>
                <CardDescription className="text-base">by {book.author}</CardDescription>
                {book.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{book.description}</p>
                )}
              </div>
            </div>
            {!book.isGlobal && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={book.loved ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${book.loved ? 'fill-current' : ''}`} />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <StarRating
              rating={book.rating}
              onRatingChange={book.isGlobal ? undefined : handleRatingChange}
              readonly={book.isGlobal}
              size="sm"
            />
            <span>•</span>
            <span>{bookRecipes.length} recipes</span>
          </div>

          {book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {book.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recipes</h2>
          {!book.isGlobal && (
            <Button onClick={() => setShowRecipeForm(true)}>
              Add Recipe
            </Button>
          )}
        </div>

        {bookRecipes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No recipes in this book yet.</p>
              {!book.isGlobal && (
                <Button 
                  onClick={() => setShowRecipeForm(true)}
                  className="mt-4"
                >
                  Add Your First Recipe
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={recipe.isGlobal ? undefined : handleEdit}
                onViewRecipe={handleViewRecipe}
                showActions={!recipe.isGlobal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recipe Form */}
      <RecipeForm
        recipe={editingRecipe}
        open={showRecipeForm}
        onOpenChange={handleCloseForm}
        mode={editingRecipe ? 'edit' : 'create'}
      />
    </div>
  );
} 