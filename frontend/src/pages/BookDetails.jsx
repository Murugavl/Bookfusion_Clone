import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/books/all")
      .then(res => {
        const selected = res.data[id];
        setBook(selected);
      });
  }, [id]);

  if (!book) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{book.title}</h2>

      <a
        href={book.file_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px"
        }}
      >
        Open PDF
      </a>
    </div>
  );
}
