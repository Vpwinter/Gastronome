'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Recipe } from '@/types';
import { RecipeCard } from './RecipeCard';
import { RecipeForm } from './RecipeForm';
import { RecipeDetailView } from './RecipeDetailView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

export function RecipesView() {
  const { recipes, globalRecipes } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showGlobal, setShowGlobal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Simple search filter
  const filteredRecipes = (showGlobal ? globalRecipes : recipes).filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setViewingRecipe(recipe);
  };

  const handleBackToRecipes = () => {
    setViewingRecipe(null);
  };

  // Check if the currently viewed recipe still exists, if not, go back to list
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
        onBack={handleBackToRecipes} 
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          {showGlobal ? 'Discover Recipes' : 'My Recipes'}
        </h2>
        <div className="flex items-center space-x-4">
          <Button
            variant={showGlobal ? 'outline' : 'default'}
            onClick={() => setShowGlobal(false)}
          >
            My Recipes ({recipes.length})
          </Button>
          <Button
            variant={showGlobal ? 'default' : 'outline'}
            onClick={() => setShowGlobal(true)}
          >
            Discover ({globalRecipes.length})
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍳</div>
          <h3 className="text-lg font-medium mb-2">
            {showGlobal ? 'No recipes found' : 'No recipes yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {showGlobal 
              ? 'Try adjusting your search terms'
              : 'Start building your recipe collection by adding your first recipe!'
            }
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Recipe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={handleEditRecipe}
              onViewRecipe={handleViewRecipe}
            />
          ))}
        </div>
      )}

      {/* Add Recipe Form */}
      <RecipeForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        mode="create"
      />

      {/* Edit Recipe Form */}
      {editingRecipe && (
        <RecipeForm
          recipe={editingRecipe}
          open={!!editingRecipe}
          onOpenChange={(open) => !open && setEditingRecipe(null)}
          mode="edit"
        />
      )}
    </div>
  );
} 