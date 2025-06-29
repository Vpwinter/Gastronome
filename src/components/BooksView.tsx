'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Book } from '@/types';
import { BookCard } from './BookCard';
import { BookForm } from './BookForm';
import { BookRecipesView } from './BookRecipesView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

export function BooksView() {
  const { books, globalBooks } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showGlobal, setShowGlobal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Simple search filter
  const filteredBooks = (showGlobal ? globalBooks : books).filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.categories.some(category => category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    book.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
  };

  const handleViewBook = (book: Book) => {
    setViewingBook(book);
  };

  const handleBackToBooks = () => {
    setViewingBook(null);
  };

  // Check if the currently viewed book still exists, if not, go back to list
  useEffect(() => {
    if (viewingBook) {
      const allBooks = [...books, ...globalBooks];
      const bookStillExists = allBooks.find(b => b.id === viewingBook.id);
      if (!bookStillExists) {
        setViewingBook(null);
      }
    }
  }, [books, globalBooks, viewingBook]);

  // If viewing a specific book, show the book recipes view
  if (viewingBook) {
    return (
      <BookRecipesView 
        book={viewingBook} 
        onBack={handleBackToBooks} 
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          {showGlobal ? 'Discover Books' : 'My Books'}
        </h2>
        <div className="flex items-center space-x-4">
          <Button
            variant={showGlobal ? 'outline' : 'default'}
            onClick={() => setShowGlobal(false)}
          >
            My Books ({books.length})
          </Button>
          <Button
            variant={showGlobal ? 'default' : 'outline'}
            onClick={() => setShowGlobal(true)}
          >
            Discover ({globalBooks.length})
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium mb-2">
            {showGlobal ? 'No books found' : 'No books yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {showGlobal 
              ? 'Try adjusting your search terms'
              : 'Start organizing your recipes by creating your first book!'
            }
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Books help you organize your recipes by theme, cuisine, or occasion.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Book
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEditBook}
              onViewBook={handleViewBook}
            />
          ))}
        </div>
      )}

      {/* Add Book Form */}
      <BookForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        mode="create"
      />

      {/* Edit Book Form */}
      {editingBook && (
        <BookForm
          book={editingBook}
          open={!!editingBook}
          onOpenChange={(open) => !open && setEditingBook(null)}
          mode="edit"
        />
      )}
    </div>
  );
} 