import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { bookService } from "../services/api";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PDFReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the plugin to avoid recreating it on every render
  const layoutPlugin = useMemo(() => defaultLayoutPlugin(), []);

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

  const loadingStyle = {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    background: "var(--bg-secondary)"
  };

  const errorStyle = {
    ...loadingStyle,
    padding: "2rem"
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
      <div style={loadingStyle}>
        <div className="spinner"></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        <div style={errorCardStyle}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📕</div>
          <h2 style={{ color: "var(--error-color)", marginBottom: "0.5rem" }}>
            Error
          </h2>
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
              fontWeight: 500,
              marginRight: "0.5rem"
            }}
          >
            Back to Library
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              borderRadius: "0.5rem",
              border: "1px solid var(--border-color)",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
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
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f0f0f0"
      }}
    >
      <div style={{
        background: "var(--bg-primary)",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "var(--shadow-sm)"
      }}>
        <div>
          <h3 style={{ 
            margin: 0, 
            fontSize: "1.125rem",
            color: "var(--text-primary)"
          }}>
            {book.title}
          </h3>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            borderRadius: "0.5rem",
            border: "1px solid var(--border-color)",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 500
          }}
        >
          ← Back to Library
        </button>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={book.file_url}
            plugins={[layoutPlugin]}
          />
        </Worker>
      </div>
    </div>
  );
}
