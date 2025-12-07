import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadBook() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState
  (null);
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

      const res = await axios.post(
        "http://127.0.0.1:5000/api/books/upload",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage(res.data.message || "Book uploaded successfully!");
      
      // Reset form
      setTitle("");
      setFile(null);
      
      // Optionally navigate to book list after a delay
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

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Upload Book</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label style={{ display: "block", marginBottom: 5 }}>
            Book Title
          </label>
          <input
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: 4
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 5 }}>
            PDF File
          </label>
          <input 
            type="file" 
            accept=".pdf,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px"
            }}
          />
        </div>

        <button 
          onClick={uploadBook}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: loading ? "#ccc" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && (
          <p style={{ color: "#d32f2f", margin: 0 }}>{error}</p>
        )}

        {message && (
          <p style={{ color: "#2e7d32", margin: 0 }}>{message}</p>
        )}
      </div>
    </div>
  );
}
