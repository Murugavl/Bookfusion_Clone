import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PDFReader from "./PDFReader";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/books/all")
      .then(res => setBook(res.data[id]));
  }, [id]);

  if (!book) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{book.title}</h2>

      <PDFReader url={book.file_url} />
    </div>
  );
}
