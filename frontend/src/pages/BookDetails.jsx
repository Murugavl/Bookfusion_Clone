import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { bookService } from "../services/api";
import PDFReader from "./PDFReader";
import Navigation from "../components/Navigation";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await bookService.getById(id);
        setBook(response.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setError("Book not found");
        } else {
          setError("Failed to load book. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);

  const pageStyle = {
    minHeight: "100vh",
    background: "var(--bg-secondary)"
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem"
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

  const errorCardStyle = {
    background: "var(--bg-primary)",
    padding: "2rem",
    borderRadius: "0.75rem",
    boxShadow: "var(--shadow-lg)",
    textAlign: "center",
    maxWidth: "500px",
    border: "1px solid var(--border-color)"
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <Navigation />
        <div style={containerStyle}>
          <div style={loadingStyle}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-secondary)" }}>Loading book details...</p>
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
            <div style={errorCardStyle}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Error</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                {error}
              </p>
              <button
                onClick={() => navigate("/")}
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
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={pageStyle}>
        <Navigation />
        <div style={containerStyle}>
          <div style={errorStyle}>
            <div style={errorCardStyle}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Book not found</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                The book you're looking for doesn't exist.
              </p>
              <button
                onClick={() => navigate("/")}
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
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navigation />
      <div style={containerStyle}>
        <div style={{
          background: "var(--bg-primary)",
          padding: "2rem",
          borderRadius: "0.75rem",
          boxShadow: "var(--shadow-md)",
          marginBottom: "2rem",
          border: "1px solid var(--border-color)"
        }}>
          <h1 style={{ 
            fontSize: "2rem", 
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "var(--text-primary)"
          }}>
            {book.title}
          </h1>
          <p style={{ 
            color: "var(--text-secondary)",
            marginBottom: "1rem"
          }}>
            View and read your book
          </p>
        </div>
        <div style={{
          background: "var(--bg-primary)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border-color)",
          minHeight: "600px"
        }}>
          <PDFReader />
        </div>
      </div>
    </div>
  );
}
