'use client';

import { useState, useEffect } from 'react';
import { Recipe, Book } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Copy, Book as BookIcon, FolderPlus } from 'lucide-react';

interface CopyDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Recipe | Book | null;
  itemType: 'recipe' | 'book';
}

export function CopyDestinationDialog({
  open,
  onOpenChange,
  item,
  itemType
}: CopyDestinationDialogProps) {
  const { books, addBook, updateBook, copyGlobalRecipe, copyGlobalBook, addRecipeToBook } = useAppStore();
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [newBookData, setNewBookData] = useState({
    title: '',
    author: '',
    description: '',
    categories: ['Personal'] as string[]
  });
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    author: false
  });



  const handleCopy = () => {
    if (!item) return;
    
    // Clear previous validation errors
    setValidationErrors({ title: false, author: false });

    if (itemType === 'recipe') {
      // Copy recipe first
      const recipe = item as Recipe;
      const newRecipeId = copyGlobalRecipe(recipe);

      // Handle book assignment
      if (selectedBookId === 'new') {
        // Validate new book data
        const titleValid = newBookData.title.trim().length > 0;
        const authorValid = newBookData.author.trim().length > 0;
        
        if (!titleValid || !authorValid) {
          setValidationErrors({
            title: !titleValid,
            author: !authorValid
          });
          return;
        }
        
        // Create new book with this recipe
        const newBook = {
          ...newBookData,
          title: newBookData.title.trim(),
          author: newBookData.author.trim(),
          description: newBookData.description.trim(),
          keywords: [],
          recipeIds: [newRecipeId], // Add the new recipe to the book
          loved: false,
          rating: 0,
          comments: []
        };
        const newBookId = addBook(newBook);
      } else if (selectedBookId && selectedBookId !== 'new') {
        // Add to existing book
        addRecipeToBook(selectedBookId, newRecipeId);
      }
      // If no book selected, recipe is just copied to user's collection
      // If no book selected, recipe is just copied to user's collection
    } else {
      // Copy book (and all its recipes)
      const book = item as Book;
      copyGlobalBook(book);
    }

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedBookId('');
    setNewBookData({
      title: '',
      author: '',
      description: '',
      categories: ['Personal']
    });
    setValidationErrors({
      title: false,
      author: false
    });
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Copy className="h-5 w-5" />
            <span>Copy {itemType === 'recipe' ? 'Recipe' : 'Book'}</span>
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to organize this {itemType === 'recipe' ? 'recipe' : 'book'} in your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Show item being copied */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-sm">{item.title}</p>
            <p className="text-xs text-muted-foreground">by {item.author}</p>
          </div>

          {itemType === 'recipe' && (
            <>
              <div className="space-y-3">
                <Label>Add to Book (Optional)</Label>
                
                {/* Option to copy without adding to book */}
                <div 
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBookId('');
                  }}
                >
                  <input
                    type="radio"
                    name="destination"
                    value=""
                    checked={selectedBookId === ''}
                    onChange={() => {}} // Handled by div onClick
                    className="rounded"
                    readOnly
                  />
                  <span className="text-sm">Just copy to my recipes</span>
                </div>

                {/* Existing books */}
                {books.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Or add to existing book:</p>
                    {books.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookId(book.id);
                        }}
                      >
                        <input
                          type="radio"
                          name="destination"
                          value={book.id}
                          checked={selectedBookId === book.id}
                          onChange={() => {}} // Handled by div onClick
                          className="rounded"
                          readOnly
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{book.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {book.recipeIds.length} recipe{book.recipeIds.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create new book option */}
                <div 
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBookId('new');
                  }}
                >
                  <input
                    type="radio"
                    name="destination"
                    value="new"
                    checked={selectedBookId === 'new'}
                    onChange={() => {}} // Handled by div onClick
                    className="rounded"
                    readOnly
                  />
                  <FolderPlus className="h-4 w-4" />
                  <span className="text-sm">Create new book</span>
                </div>

                {/* New book form */}
                {selectedBookId === 'new' && (
                  <div 
                    className="space-y-3 p-4 bg-accent/50 border-2 border-primary/20 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <FolderPlus className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">New Book Details</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bookTitle" className="text-sm font-medium">
                        Book Title*
                      </Label>
                      <Input
                        id="bookTitle"
                        value={newBookData.title}
                        onChange={(e) => {
                          setNewBookData(prev => ({ ...prev, title: e.target.value }));
                          if (validationErrors.title && e.target.value.trim()) {
                            setValidationErrors(prev => ({ ...prev, title: false }));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        placeholder="Enter book title"
                        className={validationErrors.title ? 'border-destructive focus:border-destructive' : ''}
                        required
                      />
                      {validationErrors.title && (
                        <p className="text-sm text-destructive">Book title is required</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bookAuthor" className="text-sm font-medium">
                        Author*
                      </Label>
                      <Input
                        id="bookAuthor"
                        value={newBookData.author}
                        onChange={(e) => {
                          setNewBookData(prev => ({ ...prev, author: e.target.value }));
                          if (validationErrors.author && e.target.value.trim()) {
                            setValidationErrors(prev => ({ ...prev, author: false }));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        placeholder="Your name"
                        className={validationErrors.author ? 'border-destructive focus:border-destructive' : ''}
                        required
                      />
                      {validationErrors.author && (
                        <p className="text-sm text-destructive">Author is required</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bookDescription">Description (Optional)</Label>
                      <Textarea
                        id="bookDescription"
                        value={newBookData.description}
                        onChange={(e) => setNewBookData(prev => ({ ...prev, description: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        placeholder="Describe this collection..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCopy}
            disabled={selectedBookId === 'new' && (!newBookData.title.trim() || !newBookData.author.trim())}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy {itemType === 'recipe' ? 'Recipe' : 'Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 