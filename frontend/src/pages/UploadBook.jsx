import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { bookService } from "../services/api";

export default function UploadBook() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const uploadBook = async () => {
    // Validation
    if (!title.trim()) {
      setError("Please enter a book title");
      return;
    }

    if (!file) {
      setError("Please select a file");
      return;
    }

    // Check file type (PDF)
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage("");

    try {
      const form = new FormData();    
      form.append("title", title.trim());
      form.append("file", file);

      const res = await bookService.upload(form);

      setMessage(res.data.message || "Book uploaded successfully!");
      
      // Reset form
      setTitle("");
      setFile(null);
      
      // Navigate to book list after a delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        "Failed to upload book. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    minHeight: "100vh",
    background: "var(--bg-secondary)"
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem 1.5rem"
  };

  const cardStyle = {
    background: "var(--bg-primary)",
    borderRadius: "0.75rem",
    padding: "2rem",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--border-color)"
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: "0.5rem"
  };

  const subtitleStyle = {
    color: "var(--text-secondary)",
    fontSize: "1rem",
    marginBottom: "2rem"
  };

  const formGroupStyle = {
    marginBottom: "1.5rem"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    color: "var(--text-primary)",
    fontSize: "0.875rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "1px solid var(--border-color)",
    borderRadius: "0.5rem",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    transition: "all 0.2s ease"
  };

  const fileInputWrapperStyle = {
    border: "2px dashed var(--border-color)",
    borderRadius: "0.5rem",
    padding: "2rem",
    textAlign: "center",
    background: "var(--bg-secondary)",
    transition: "all 0.2s ease",
    cursor: "pointer"
  };

  const fileInputStyle = {
    ...inputStyle,
    border: "none",
    background: "transparent",
    cursor: "pointer"
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.875rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 600,
    background: loading ? "var(--text-tertiary)" : "var(--primary-color)",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem"
  };

  const errorStyle = {
    padding: "0.875rem 1rem",
    background: "rgba(239, 68, 68, 0.1)",
    color: "var(--error-color)",
    borderRadius: "0.5rem",
    marginTop: "1rem",
    border: "1px solid rgba(239, 68, 68, 0.2)"
  };

  const successStyle = {
    padding: "0.875rem 1rem",
    background: "rgba(16, 185, 129, 0.1)",
    color: "var(--success-color)",
    borderRadius: "0.5rem",
    marginTop: "1rem",
    border: "1px solid rgba(16, 185, 129, 0.2)"
  };

  return (
    <div style={pageStyle}>
      <Navigation />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Upload Book</h1>
          <p style={subtitleStyle}>
            Add a new PDF book to your library
          </p>
          
          <div style={formGroupStyle}>
            <label style={labelStyle}>Book Title *</label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>PDF File *</label>
            <div style={fileInputWrapperStyle}>
              <input 
                type="file" 
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={loading}
                style={fileInputStyle}
              />
              {file && (
                <p style={{ 
                  marginTop: "0.5rem", 
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem"
                }}>
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={uploadBook}
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: "20px", height: "20px", borderWidth: "2px" }}></div>
                Uploading...
              </>
            ) : (
              <>
                📤 Upload Book
              </>
            )}
          </button>

          {error && (
            <div style={errorStyle}>
              ⚠️ {error}
            </div>
          )}

          {message && (
            <div style={successStyle}>
              ✅ {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
