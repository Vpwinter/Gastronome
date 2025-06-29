'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Recipe } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { CopyDestinationDialog } from './CopyDestinationDialog';
import { Heart, Star, Clock, Users, Edit, Trash2, Copy } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onViewRecipe?: (recipe: Recipe) => void;
  showActions?: boolean;
}

export function RecipeCard({ recipe, onEdit, onViewRecipe, showActions = true }: RecipeCardProps) {
  const { updateRecipe, deleteRecipe } = useAppStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const toggleLove = () => {
    if (!recipe.isGlobal) {
      updateRecipe(recipe.id, { loved: !recipe.loved });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteRecipe(recipe.id);
  };

  const handleCopyClick = () => {
    setShowCopyDialog(true);
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

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onViewRecipe?.(recipe)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{recipe.title}</CardTitle>
            <CardDescription>by {recipe.author}</CardDescription>
          </div>
          {showActions && (
            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
              {recipe.isGlobal ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyClick}
                  title="Copy to my recipes"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              ) : (
                <>
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
                    onClick={() => onEdit?.(recipe)}
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
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {recipe.picture && (
          <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden relative">
            <Image
              src={recipe.picture}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.timeMinutes} min</span>
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

        <div className="space-y-2">
          <h4 className="font-medium">Ingredients</h4>
          <ul className="text-sm space-y-1">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="text-muted-foreground">
                • {ingredient.amount && ingredient.measure 
                    ? `${ingredient.amount} ${ingredient.measure} ${ingredient.name}`
                    : ingredient.amount 
                    ? `${ingredient.amount} ${ingredient.name}`
                    : ingredient.name}
              </li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-xs text-muted-foreground">
                ... and {recipe.ingredients.length - 3} more
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Recipe"
        description="This action cannot be undone. This will permanently delete the recipe from your collection."
        itemName={recipe.title}
      />

      <CopyDestinationDialog
        open={showCopyDialog}
        onOpenChange={setShowCopyDialog}
        item={recipe}
        itemType="recipe"
      />
    </Card>
  );
} 