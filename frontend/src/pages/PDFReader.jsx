import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PDFReader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the plugin to avoid recreating it on every render
  const layoutPlugin = useMemo(() => defaultLayoutPlugin(), []);

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
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px"
      }}>
        <h2 style={{ color: "#d32f2f" }}>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <h2>Book not found</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
      }}
    >
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
