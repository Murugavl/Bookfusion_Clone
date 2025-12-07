import { Routes, Route } from "react-router-dom";
import BookList from "./pages/BookList";
import PDFReader from "./pages/PDFReader";
import UploadBook from "./pages/UploadBook";
import BookDetails from "./pages/BookDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/upload" element={<UploadBook />} />
      <Route path="/book/:id" element={<PDFReader />} />
      <Route path="/book/:id/details" element={<BookDetails />} />
    </Routes>
  );
}
