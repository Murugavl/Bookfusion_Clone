import { Routes, Route } from "react-router-dom";
import BookList from "./pages/BookList";
import PDFReader from "./pages/PDFReader";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/book/:id" element={<PDFReader />} />
    </Routes>
  );
}
