import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
  axios.get("http://127.0.0.1:5000/api/books/all")
    .then(res => {
      console.log("BOOK DATA:", res.data);   // <-- ADD THIS
      setBooks(res.data)
    })
    .catch(err => console.log(err));
}, []);


  return (
    <div style={{ padding: 20 }}>
      <h2>Your Library</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 20
      }}>

        {books.map((book, index) => (
          <div key={index} style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 15
          }}>

            {/* FIXED HERE */}
            <Link to={`/book/${book._id}`} style={{ textDecoration: "none" }}>
              <h3>{book.title}</h3>
            </Link>

            <a 
              href={book.file_url} 
              target="_blank"
              rel="noopener noreferrer"
            >
              Open File
            </a>

          </div>
        ))}

      </div>
    </div>
  );
}
