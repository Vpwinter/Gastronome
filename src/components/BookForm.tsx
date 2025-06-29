'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types';
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
import { Plus, X, Book as BookIcon } from 'lucide-react';

interface BookFormProps {
  book?: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
}

export function BookForm({ book, open, onOpenChange, mode }: BookFormProps) {
  const { addBook, updateBook, recipes } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    picture: '',
    categories: [] as string[],
    keywords: [] as string[],
    recipeIds: [] as string[],
    loved: false,
    rating: 0,
    comments: [] as string[]
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    if (book && mode === 'edit') {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || '',
        picture: book.picture || '',
        categories: book.categories,
        keywords: book.keywords,
        recipeIds: book.recipeIds,
        loved: book.loved,
        rating: book.rating,
        comments: book.comments
      });
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        author: '',
        description: '',
        picture: '',
        categories: [],
        keywords: [],
        recipeIds: [],
        loved: false,
        rating: 0,
        comments: []
      });
    }
  }, [book, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'edit' && book) {
      updateBook(book.id, formData);
    } else {
      addBook(formData);
    }
    
    onOpenChange(false);
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryInput.trim()]
      }));
      setCategoryInput('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
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

  const toggleRecipe = (recipeId: string) => {
    setFormData(prev => ({
      ...prev,
      recipeIds: prev.recipeIds.includes(recipeId)
        ? prev.recipeIds.filter(id => id !== recipeId)
        : [...prev.recipeIds, recipeId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Book' : 'Create New Book'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter book title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author*</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Author name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this recipe collection..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Picture URL (optional)</Label>
            <Input
              id="picture"
              type="url"
              value={formData.picture}
              onChange={(e) => setFormData(prev => ({ ...prev, picture: e.target.value }))}
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex items-center space-x-1"
                >
                  <span>{category}</span>
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={handleCategoryKeyPress}
                placeholder="Add category (press Enter)"
              />
              <Button type="button" onClick={addCategory} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
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
                placeholder="Add keyword (press Enter)"
              />
              <Button type="button" onClick={addKeyword} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recipes</Label>
            <p className="text-sm text-muted-foreground">
              Select recipes to include in this book
            </p>
            {recipes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No recipes available. Create some recipes first to add them to books.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {recipes.map((recipe) => (
                  <label
                    key={recipe.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.recipeIds.includes(recipe.id)}
                      onChange={() => toggleRecipe(recipe.id)}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{recipe.title}</div>
                      <div className="text-xs text-muted-foreground">
                        by {recipe.author} • {recipe.timeMinutes} min
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Selected: {formData.recipeIds.length} recipe{formData.recipeIds.length !== 1 ? 's' : ''}
            </p>
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
              <BookIcon className="h-4 w-4 mr-2" />
              {mode === 'edit' ? 'Update Book' : 'Create Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 