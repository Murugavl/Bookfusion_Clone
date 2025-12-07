import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Your Library</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Your Library</h2>
        <p style={{ color: "#d32f2f" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 20
      }}>
        <h2 style={{ margin: 0 }}>Your Library</h2>
        <Link 
          to="/upload" 
          style={{ 
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            textDecoration: "none",
            borderRadius: 4
          }}
        >
          Upload Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div style={{
          padding: 40,
          textAlign: "center",
          color: "#666"
        }}>
          <p>No books in your library yet.</p>
          <Link to="/upload" style={{ 
            color: "#1976d2",
            textDecoration: "none"
          }}>
            Upload your first book
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20
        }}>
          {books.map((book) => (
            <div key={book._id} style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}>
              <Link 
                to={`/book/${book._id}`} 
                style={{ 
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
                <h3 style={{ margin: 0 }}>{book.title}</h3>
              </Link>

              <a 
                href={book.file_url} 
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontSize: "14px"
                }}
              >
                Open File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
