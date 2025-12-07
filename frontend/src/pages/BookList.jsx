import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get("http://127.0.0.1:5000/api/books/all")
      .then(res => {
        setBooks(res.data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load books. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const pageStyle = {
    minHeight: "100vh",
    background: "var(--bg-secondary)"
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem"
  };

  const headerStyle = {
    marginBottom: "2rem"
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "0.5rem"
  };

  const subtitleStyle = {
    color: "var(--text-secondary)",
    fontSize: "1rem"
  };

  const loadingStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "1rem"
  };

  const errorStyle = {
    ...loadingStyle,
    color: "var(--error-color)"
  };

  const emptyStateStyle = {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "var(--bg-primary)",
    borderRadius: "0.75rem",
    boxShadow: "var(--shadow-md)"
  };

  const emptyIconStyle = {
    fontSize: "4rem",
    marginBottom: "1rem"
  };

  const emptyTextStyle = {
    color: "var(--text-secondary)",
    fontSize: "1.125rem",
    marginBottom: "1.5rem"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.5rem"
  };

  const cardStyle = {
    background: "var(--bg-primary)",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    border: "1px solid var(--border-color)"
  };

  const bookTitleStyle = {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: 0,
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  };

  const actionButtonStyle = {
    padding: "0.625rem 1rem",
    background: "var(--primary-color)",
    color: "white",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    textAlign: "center",
    transition: "all 0.2s ease",
    display: "block"
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <Navigation />
        <div style={containerStyle}>
          <div style={loadingStyle}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-secondary)" }}>Loading your library...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <Navigation />
        <div style={containerStyle}>
          <div style={errorStyle}>
            <div style={{ fontSize: "3rem" }}>⚠️</div>
            <h2 style={{ margin: 0 }}>Error</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "var(--primary-color)",
                color: "white",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navigation />
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Your Library</h1>
          <p style={subtitleStyle}>
            {books.length === 0 
              ? "Start building your digital library" 
              : `${books.length} ${books.length === 1 ? 'book' : 'books'} in your collection`}
          </p>
        </div>

        {books.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={emptyIconStyle}>📚</div>
            <h2 style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Your library is empty
            </h2>
            <p style={emptyTextStyle}>
              Upload your first book to get started
            </p>
            <Link 
              to="/upload"
              style={{
                ...actionButtonStyle,
                display: "inline-block"
              }}
            >
              Upload Your First Book
            </Link>
          </div>
        ) : (
          <div style={gridStyle}>
            {books.map((book) => (
              <div 
                key={book._id} 
                className="book-card"
                style={cardStyle}
              >
                <Link 
                  to={`/book/${book._id}`} 
                  style={{ 
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >
                  <div style={{
                    width: "100%",
                    height: "200px",
                    background: "linear-gradient(135deg, var(--primary-light), var(--secondary-color))",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    📖
                  </div>
                  <h3 style={bookTitleStyle}>{book.title}</h3>
                </Link>
                <a 
                  href={book.file_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={actionButtonStyle}
                >
                  Open PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
