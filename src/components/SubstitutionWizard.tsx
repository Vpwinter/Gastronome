'use client';

import { useState, useMemo } from 'react';
import { findSubstitutions } from '@/lib/cooking-data';
import { IngredientSubstitution } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Search, Lightbulb, AlertTriangle, Info } from 'lucide-react';

export default function SubstitutionWizard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContext, setSelectedContext] = useState<'both' | 'baking' | 'cooking'>('both');
  
  // Find substitutions based on search term
  const substitutions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const results = findSubstitutions(searchTerm.trim());
    
    // Filter by context if specified
    if (selectedContext !== 'both') {
      return results.filter(sub => 
        sub.context === 'both' || sub.context === selectedContext
      );
    }
    
    return results;
  }, [searchTerm, selectedContext]);

  // Group substitutions by original ingredient
  const groupedSubstitutions = useMemo(() => {
    const groups: Record<string, IngredientSubstitution[]> = {};
    
    substitutions.forEach(sub => {
      if (!groups[sub.original]) {
        groups[sub.original] = [];
      }
      groups[sub.original].push(sub);
    });
    
    return groups;
  }, [substitutions]);

  const getRatioText = (ratio: number) => {
    if (ratio === 1.0) return '1:1 ratio';
    if (ratio < 1.0) return `Use ${ratio}x the amount`;
    return `Use ${ratio}x the amount`;
  };

  const getContextBadgeVariant = (context?: string) => {
    switch (context) {
      case 'baking': return 'secondary';
      case 'cooking': return 'outline';
      default: return 'default';
    }
  };

  const getContextIcon = (context?: string) => {
    switch (context) {
      case 'baking': return '🥧';
      case 'cooking': return '🍳';
      default: return '👨‍🍳';
    }
  };

  // Common ingredients for quick access
  const commonIngredients = [
    'butter', 'milk', 'egg', 'flour', 'sugar', 'vanilla extract',
    'baking powder', 'heavy cream', 'sour cream', 'lemon juice'
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
          <ArrowRight className="h-6 w-6" />
          Ingredient Substitution Wizard
        </div>
        <p className="text-muted-foreground">
          Find perfect alternatives for any cooking ingredient with proper ratios and tips
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find Substitutions</CardTitle>
          <CardDescription>
            Search for any ingredient to discover alternative options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter ingredient name (e.g., butter, milk, egg)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Context Filter */}
          <div className="flex gap-2">
            <span className="text-sm font-medium self-center">Context:</span>
            <Button
              variant={selectedContext === 'both' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedContext('both')}
            >
              👨‍🍳 All Cooking
            </Button>
            <Button
              variant={selectedContext === 'baking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedContext('baking')}
            >
              🥧 Baking Only
            </Button>
            <Button
              variant={selectedContext === 'cooking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedContext('cooking')}
            >
              🍳 Cooking Only
            </Button>
          </div>

          {/* Quick Access */}
          {!searchTerm && (
            <div>
              <p className="text-sm font-medium mb-2">Common Ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {commonIngredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent capitalize"
                    onClick={() => setSearchTerm(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {searchTerm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Substitutions for "{searchTerm}" ({substitutions.length} found)
            </h2>
          </div>

          {substitutions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No substitutions found</p>
                <p className="text-muted-foreground mb-4">
                  Try searching for a more common ingredient or check your spelling
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['butter', 'milk', 'egg', 'flour'].map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setSearchTerm(suggestion)}
                    >
                      Try "{suggestion}"
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Substitution Cards */}
          <div className="space-y-4">
            {Object.entries(groupedSubstitutions).map(([original, subs]) => (
              <Card key={original}>
                <CardHeader>
                  <CardTitle className="capitalize text-lg">
                    {original} Substitutions
                  </CardTitle>
                  <CardDescription>
                    {subs.length} alternative{subs.length !== 1 ? 's' : ''} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {subs.map((sub, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium capitalize">
                              {sub.original}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium capitalize text-primary">
                              {sub.substitute}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary">
                              {getRatioText(sub.ratio)}
                            </Badge>
                            {sub.context && sub.context !== 'both' && (
                              <Badge variant={getContextBadgeVariant(sub.context)}>
                                {getContextIcon(sub.context)} {sub.context}
                              </Badge>
                            )}
                          </div>
                          
                          {sub.notes && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{sub.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Substitution Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">🥧 Baking Substitutions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Be precise with measurements - baking is chemistry</li>
                <li>• Test small batches when trying new substitutions</li>
                <li>• Consider texture and flavor impact</li>
                <li>• Some substitutions may affect rise and texture</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">🍳 Cooking Substitutions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• More flexible with measurements and ratios</li>
                <li>• Taste as you go and adjust seasonings</li>
                <li>• Consider cooking method compatibility</li>
                <li>• Fresh vs dried herbs have different intensities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 