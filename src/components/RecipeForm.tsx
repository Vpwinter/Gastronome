'use client';

import React, { useState, useEffect } from 'react';
import { Recipe, Ingredient, COOKING_MEASURES } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Clock, Users } from 'lucide-react';

interface RecipeFormProps {
  recipe?: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
}

export function RecipeForm({ recipe, open, onOpenChange, mode }: RecipeFormProps) {
  const { addRecipe, updateRecipe } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    picture: '',
    keywords: [] as string[],
    ingredients: [{ name: '', amount: '', measure: '' }] as Ingredient[],
    steps: [''],
    timeMinutes: 30,
    servings: 4,
    loved: false,
    rating: 0,
    comments: [] as string[]
  });

  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (recipe && mode === 'edit') {
      setFormData({
        title: recipe.title,
        author: recipe.author,
        picture: recipe.picture || '',
        keywords: recipe.keywords,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: '', measure: '' }],
        steps: recipe.steps.length > 0 ? recipe.steps : [''],
        timeMinutes: recipe.timeMinutes,
        servings: recipe.servings,
        loved: recipe.loved,
        rating: recipe.rating,
        comments: recipe.comments
      });
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        author: '',
        picture: '',
        keywords: [],
        ingredients: [{ name: '', amount: '', measure: '' }],
        steps: [''],
        timeMinutes: 30,
        servings: 4,
        loved: false,
        rating: 0,
        comments: []
      });
    }
  }, [recipe, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.name.trim() !== ''),
      steps: formData.steps.filter(s => s.trim() !== '')
    };

    if (mode === 'edit' && recipe) {
      updateRecipe(recipe.id, cleanedData);
    } else {
      addRecipe(cleanedData);
    }
    
    onOpenChange(false);
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', measure: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index:  number, field: keyof Ingredient, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((item, i) => i === index ? value : item)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Recipe' : 'Add New Recipe'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter recipe title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author*</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Chef's name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Picture URL (optional)</Label>
            <Input
              id="picture"
              type="url"
              value={formData.picture}
              onChange={(e) => setFormData(prev => ({ ...prev, picture: e.target.value }))}
              placeholder="https://example.com/recipe-image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Cooking Time (minutes)*</span>
              </Label>
              <Input
                id="time"
                type="number"
                min="1"
                value={formData.timeMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, timeMinutes: parseInt(e.target.value) || 30 }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="servings" className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Servings*</span>
              </Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 4 }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Keywords</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full flex items-center space-x-1"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                placeholder="Add keyword"
                className="flex-1"
              />
              <Button type="button" onClick={addKeyword} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ingredients*</Label>
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={ingredient.amount || ''}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      placeholder="Amount"
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={ingredient.measure || 'no-unit'}
                      onValueChange={(value) => updateIngredient(index, 'measure', value === 'no-unit' ? '' : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-unit">No unit</SelectItem>
                        {COOKING_MEASURES.map((measure) => (
                          <SelectItem key={measure} value={measure}>
                            {measure}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      disabled={formData.ingredients.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" onClick={addIngredient} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Cooking Steps*</Label>
            <div className="space-y-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </div>
                  <Textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Step ${index + 1} instructions`}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeStep(index)}
                    disabled={formData.steps.length === 1}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" onClick={addStep} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Update Recipe' : 'Create Recipe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 