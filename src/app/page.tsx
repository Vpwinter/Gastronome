'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Navigation } from '@/components/Navigation';
import { RecipesView } from '@/components/RecipesView';
import { BooksView } from '@/components/BooksView';
import IngredientRecommender from '@/components/IngredientRecommender';
import { FloatingToolsMenu } from '@/components/FloatingToolsMenu';

export default function Home() {
  const { currentView, loadFromStorage, theme } = useAppStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'cozy', 'seasonal');
    root.classList.add(theme);
  }, [theme]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'recipes':
        return <RecipesView />;
      case 'books':
        return <BooksView />;
      case 'ingredient-recommender':
        return <IngredientRecommender />;
      case 'search':
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Search</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium mb-2">Advanced Search coming soon!</h3>
              <p className="text-muted-foreground">
                This feature is part of Version 3 and will include full-text search across all content.
              </p>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Cooking Tools</h2>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧮</div>
              <h3 className="text-lg font-medium mb-2">Cooking Tools are now available!</h3>
              <p className="text-muted-foreground">
                Use the floating tools button in the bottom-right corner to access ingredient substitutions and measurement conversions.
              </p>
            </div>
          </div>
        );
      default:
        return <RecipesView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {renderCurrentView()}
      </main>
      <FloatingToolsMenu />
    </div>
  );
}
