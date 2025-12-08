# Vel's BookCloud 📚

A modern digital library application for managing and reading PDF books, inspired by BookFusion.

## Features

- 📖 **Digital Bookshelf** - Beautiful dark-themed interface to browse your library
- 🔍 **Search & Filter** - Search books and filter by status (All, Favorites, Plan to Read, Completed)
- 📚 **PDF Reader** - Full-featured PDF reader with:
  - Page navigation and jumping
  - Font size adjustment
  - Layout options (single, double, continuous)
  - Notes and highlights
  - Reading progress tracking
  - Fullscreen mode
- ☁️ **Cloud Storage** - Books stored in Supabase cloud storage
- 📊 **Progress Tracking** - Automatic reading progress saving
- ⭐ **Book Status Management** - Organize books by status
- 📝 **Notes & Highlights** - Add notes and highlights while reading

## Tech Stack

### Frontend
- React 19
- React Router
- Vite
- PDF.js for PDF rendering
- Axios for API calls

### Backend
- Flask (Python)
- MongoDB
- Supabase (File Storage)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- MongoDB
- Supabase account (for file storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bookfusion_Clone
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Mac/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Configure Backend**
   Create a `.env` file in the `backend` directory:
   ```env
   FLASK_SECRET_KEY=your-secret-key
   MONGODB_URI=mongodb://localhost:27017/bookfusion
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   SUPABASE_BUCKET=books
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

5. **Configure Frontend**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:5000
   ```

### Running the Application

1. **Start Backend**
   ```bash
   cd backend
   python run.py
   ```
   Backend will run on `http://127.0.0.1:5000`

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open Browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
Bookfusion_Clone/
├── backend/
│   ├── app/
│   │   ├── routes/          # API routes
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── config.py        # Configuration
│   │   └── __init__.py      # Flask app factory
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## API Endpoints

### Books
- `GET /api/books/all` - Get all books
- `GET /api/books/<id>` - Get book by ID
- `POST /api/books/upload` - Upload a new book
- `PATCH /api/books/<id>` - Update book
- `DELETE /api/books/<id>` - Delete book
- `POST /api/books/<id>/progress` - Update reading progress
- `POST /api/books/<id>/notes` - Add a note
- `POST /api/books/<id>/highlights` - Add a highlight

## Environment Variables

### Backend (.env)
- `FLASK_SECRET_KEY` - Flask secret key
- `MONGODB_URI` - MongoDB connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase API key
- `SUPABASE_BUCKET` - Supabase storage bucket name (default: "books")
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (default: "*")

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (default: "http://127.0.0.1:5000")

## Features in Detail

### Book Management
- Upload PDF books with title
- View books in a grid layout
- Search books by title or author
- Filter by status (All, Favorites, Plan to Read, Completed)
- Automatic reading progress tracking

### Reading Experience
- Smooth PDF rendering
- Page navigation with slider
- Font size adjustment
- Multiple layout modes
- Notes and highlights panel
- Fullscreen reading mode

## Development

### Code Style
- ESLint configured for React
- Follow React best practices
- Use functional components and hooks

### Adding New Features
1. Backend: Add routes in `backend/app/routes/`
2. Frontend: Add pages in `frontend/src/pages/`
3. API: Use the centralized API service in `frontend/src/services/api.js`

## Production Deployment

1. Update environment variables for production
2. Build frontend: `npm run build`
3. Configure CORS with specific origins
4. Set up proper logging
5. Configure MongoDB connection string
6. Set up Supabase storage bucket

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists with all required variables
- Check port 5000 is available

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Check CORS configuration in backend
- Ensure backend is running

### PDFs won't load
- Check Supabase bucket configuration
- Verify file URLs are accessible
- Check browser console for CORS errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Acknowledgments

- Inspired by BookFusion
- Uses PDF.js for PDF rendering
- Built with React and Flask
