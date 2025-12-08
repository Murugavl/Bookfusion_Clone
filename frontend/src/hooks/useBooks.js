import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../services/api';
import { getBookStatus, getBookProgress } from '../utils/bookStorage';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookService.getAll();
      
      // Enhance books with local storage data
      const enhancedBooks = response.data.map(book => ({
        ...book,
        status: book.status || getBookStatus(book._id),
        progress: getBookProgress(book._id)
      }));
      
      setBooks(enhancedBooks);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load books. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks, setBooks };
};


