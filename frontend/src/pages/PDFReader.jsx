import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = 
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFReader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
  axios.get("http://127.0.0.1:5000/api/books/all")
    .then(res => {
      console.log("BOOKS FROM API:", res.data);
      console.log("URL PARAM id:", id);

      const found = res.data.find(b => b._id === id);
      console.log("FOUND BOOK:", found);

      setBook(found);
    })
    .catch(err => console.log(err));
}, [id]);



  if (!book) return <h2>Loading...</h2>;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{book.title}</h2>

      <Document
        file={book.file_url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => console.log("PDF ERROR:", err)}
      >
        <Page pageNumber={1} />
      </Document>

      <p>Page 1 of {numPages}</p>
    </div>
  );
}
