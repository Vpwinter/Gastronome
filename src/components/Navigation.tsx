'use client';

import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, ChefHat, Book, Search, Wrench, Palette, ChevronDown, Calculator, ArrowRightLeft } from 'lucide-react';
import { Theme, AppState } from '@/types';

export function Navigation() {
  const { currentView, setCurrentView, theme, setTheme } = useAppStore();

  const themes: Theme[] = ['light', 'dark', 'cozy', 'seasonal'];
  const themeIcons = {
    light: Sun,
    dark: Moon,
    cozy: ChefHat,
    seasonal: Palette
  };

  const getThemeLabel = (theme: Theme) => {
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const navigationItems = [
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'ingredient-recommender', label: 'Ingredient Finder', icon: Search },
    { id: 'substitution-wizard', label: 'Substitutions', icon: ArrowRightLeft },
    { id: 'measurement-converter', label: 'Converter', icon: Calculator },
  ] as const;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Gastronome</h1>
            </div>
            
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView(item.id as AppState['currentView'])}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  {(() => {
                    const IconComponent = themeIcons[theme];
                    return <IconComponent className="h-4 w-4" />;
                  })()}
                  <span className="hidden sm:inline">{getThemeLabel(theme)}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {themes.map((themeOption) => {
                  const IconComponent = themeIcons[themeOption];
                  return (
                    <DropdownMenuItem
                      key={themeOption}
                      onClick={() => setTheme(themeOption)}
                      className="flex items-center space-x-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{getThemeLabel(themeOption)}</span>
                      {theme === themeOption && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
} 