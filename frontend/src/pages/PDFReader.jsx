import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function PDFReader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const layoutPlugin = defaultLayoutPlugin();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/books/")
      .then(res => {
        const found = res.data.find(b => b.id === id);
        setBook(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!book) return <h2>Loading...</h2>;

  return (
    <div
    style={{
        width: "100%",
        height: "100vh",        // full-screen height
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
