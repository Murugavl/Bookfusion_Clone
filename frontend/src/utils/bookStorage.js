// Utility functions for managing book data in localStorage

export const getBookStatus = (bookId) => {
  const statuses = JSON.parse(localStorage.getItem('bookStatuses') || '{}');
  return statuses[bookId] || 'All';
};

export const setBookStatus = (bookId, status) => {
  const statuses = JSON.parse(localStorage.getItem('bookStatuses') || '{}');
  statuses[bookId] = status;
  localStorage.setItem('bookStatuses', JSON.stringify(statuses));
};

export const getBookProgress = (bookId) => {
  const progress = JSON.parse(localStorage.getItem('bookProgress') || '{}');
  return progress[bookId] || { page: 0, progress: 0 };
};

export const setBookProgress = (bookId, page, totalPages) => {
  const progress = JSON.parse(localStorage.getItem('bookProgress') || '{}');
  const progressPercent = totalPages > 0 ? (page / totalPages) * 100 : 0;
  progress[bookId] = { page, progress: progressPercent };
  localStorage.setItem('bookProgress', JSON.stringify(progress));
};

export const getBookNotes = (bookId) => {
  const notes = JSON.parse(localStorage.getItem('bookNotes') || '{}');
  return notes[bookId] || [];
};

export const addBookNote = (bookId, note) => {
  const notes = JSON.parse(localStorage.getItem('bookNotes') || '{}');
  if (!notes[bookId]) notes[bookId] = [];
  notes[bookId].push({
    id: Date.now().toString(),
    ...note,
    created_at: new Date().toISOString()
  });
  localStorage.setItem('bookNotes', JSON.stringify(notes));
};

export const getBookHighlights = (bookId) => {
  const highlights = JSON.parse(localStorage.getItem('bookHighlights') || '{}');
  return highlights[bookId] || [];
};

export const addBookHighlight = (bookId, highlight) => {
  const highlights = JSON.parse(localStorage.getItem('bookHighlights') || '{}');
  if (!highlights[bookId]) highlights[bookId] = [];
  highlights[bookId].push({
    id: Date.now().toString(),
    ...highlight,
    created_at: new Date().toISOString()
  });
  localStorage.setItem('bookHighlights', JSON.stringify(highlights));
};



