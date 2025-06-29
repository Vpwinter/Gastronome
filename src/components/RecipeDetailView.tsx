'use client';

import { useState } from 'react';
import { Recipe } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { RecipeForm } from './RecipeForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Clock, Users, Star, Heart, Edit, Trash2, ChefHat } from 'lucide-react';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
}

export function RecipeDetailView({ recipe, onBack }: RecipeDetailViewProps) {
  const { updateRecipe, deleteRecipe } = useAppStore();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleLove = () => {
    if (!recipe.isGlobal) {
      updateRecipe(recipe.id, { loved: !recipe.loved });
    }
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteRecipe(recipe.id);
    onBack(); // Go back to recipes list after deletion
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-200'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatIngredient = (ingredient: typeof recipe.ingredients[0]) => {
    if (ingredient.amount && ingredient.measure) {
      return `${ingredient.amount} ${ingredient.measure} ${ingredient.name}`;
    } else if (ingredient.amount) {
      return `${ingredient.amount} ${ingredient.name}`;
    } else {
      return ingredient.name;
    }
  };

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
          <span>Back to Recipes</span>
        </Button>
      </div>

      {/* Recipe Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{recipe.title}</CardTitle>
                <CardDescription className="text-base">by {recipe.author}</CardDescription>
              </div>
            </div>
            {!recipe.isGlobal && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLove}
                  className={recipe.loved ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${recipe.loved ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteClick}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {recipe.picture && (
            <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={recipe.picture}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.timeMinutes} minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center space-x-1">
              {renderStars(recipe.rating)}
              <span>({recipe.rating})</span>
            </div>
          </div>

          {recipe.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.keywords.map((keyword) => (
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

      {/* Ingredients Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm">{formatIngredient(ingredient)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Instructions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Comments Section (if any) */}
      {recipe.comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.comments.map((comment, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {comment}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recipe Dates */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Created: {new Date(recipe.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <RecipeForm
        recipe={recipe}
        open={showEditForm}
        onOpenChange={handleCloseForm}
        mode="edit"
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Recipe"
        description="This action cannot be undone. This will permanently delete the recipe from your collection."
        itemName={recipe.title}
      />
    </div>
  );
} 