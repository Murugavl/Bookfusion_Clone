import { useState } from "react";
import axios from "axios";

export default function UploadBook() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const uploadBook = async () => {
    const form = new FormData();    
    form.append("title", title);
    form.append("file", file);

    const res = await axios.post(
      "http://127.0.0.1:5000/api/books/upload",
      form
    );

    setMessage(res.data.message);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Book</h2>
      <input
        type="text"
        placeholder="Book Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={uploadBook}>Upload</button>
      <p>{message}</p>
    </div>
  );
}
