'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { CopyDestinationDialog } from './CopyDestinationDialog';
import { Heart, BookOpen, Edit, Trash2, Copy } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onViewBook?: (book: Book) => void;
  showActions?: boolean;
}

export function BookCard({ book, onEdit, onViewBook, showActions = true }: BookCardProps) {
  const { updateBook, deleteBook, recipes, globalRecipes } = useAppStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  const toggleLove = () => {
    if (!book.isGlobal) {
      updateBook(book.id, { loved: !book.loved });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteBook(book.id);
  };

  const handleCopyClick = () => {
    setShowCopyDialog(true);
  };

  // Get recipe count from the book's recipe IDs
  const availableRecipes = book.isGlobal ? [...globalRecipes, ...recipes] : recipes;
  const bookRecipes = availableRecipes.filter(recipe => book.recipeIds.includes(recipe.id));

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={() => onViewBook?.(book)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{book.title}</CardTitle>
            <CardDescription>by {book.author}</CardDescription>
          </div>
          {showActions && (
            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
              {book.isGlobal ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyClick}
                  title="Copy to my books"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLove}
                    className={book.loved ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${book.loved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(book)}
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
        {book.picture && (
          <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden relative">
            <Image
              src={book.picture}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {book.description && (
          <p className="text-sm text-muted-foreground">{book.description}</p>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{bookRecipes.length} recipes</span>
          </div>
          <StarRating
            rating={book.rating}
            readonly={true}
            size="sm"
          />
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

        {bookRecipes.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Sample Recipes</h4>
            <ul className="text-sm space-y-1">
              {bookRecipes.slice(0, 3).map((recipe) => (
                <li key={recipe.id} className="text-muted-foreground">
                  • {recipe.title}
                </li>
              ))}
              {bookRecipes.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  ... and {bookRecipes.length - 3} more recipes
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Book"
        description="This action cannot be undone. This will permanently delete the book and remove it from your collection."
        itemName={book.title}
      />

      <CopyDestinationDialog
        open={showCopyDialog}
        onOpenChange={setShowCopyDialog}
        item={book}
        itemType="book"
      />
    </Card>
  );
} 