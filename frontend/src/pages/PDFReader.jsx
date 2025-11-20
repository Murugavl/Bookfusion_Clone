import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";


// Required worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFReader({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {numPages}
        </span>

        <button onClick={() => setPage((p) => Math.min(p + 1, numPages))}>
          Next
        </button>
      </div>

      <Document file={url} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={page} />
      </Document>
    </div>
  );
}
