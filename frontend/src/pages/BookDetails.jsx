import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PDFReader from "./PDFReader";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get("http://127.0.0.1:5000/api/books/all")
      .then(res => {
        const found = res.data.find(b => b._id === id);
        if (found) {
          setBook(found);
        } else {
          setError("Book not found");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load book. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2 style={{ color: "#d32f2f" }}>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Book not found</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{book.title}</h2>
      <PDFReader />
    </div>
  );
}
