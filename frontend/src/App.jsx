import { Routes, Route } from "react-router-dom";
import BookList from "./pages/BookList";
import BookDetails from "./pages/BookDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/book/:id" element={<BookDetails />} />
    </Routes>
  );
}
