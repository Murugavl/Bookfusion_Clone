import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import { setBookProgress, getBookNotes, addBookNote, getBookHighlights, addBookHighlight } from "../utils/bookStorage";

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default function Reader() {
  const { bookId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const pdfUrl = searchParams.get("pdfUrl") ? decodeURIComponent(searchParams.get("pdfUrl")) : null;
  const title = searchParams.get("title") ? decodeURIComponent(searchParams.get("title")) : "Untitled Book";
  
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [layout, setLayout] = useState("single"); // single, double, continuous
  const [notes, setNotes] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const notesPanelRef = useRef(null);

  // Load saved progress
  useEffect(() => {
    if (bookId && totalPages > 0) {
      const savedProgress = JSON.parse(localStorage.getItem('bookProgress') || '{}');
      if (savedProgress[bookId]) {
        setCurrentPage(savedProgress[bookId].page || 1);
      }
      // Load notes and highlights
      setNotes(getBookNotes(bookId));
      setHighlights(getBookHighlights(bookId));
    }
  }, [bookId, totalPages]);

  useEffect(() => {
    if (!pdfUrl) {
      setError("PDF URL is required");
      setLoading(false);
      return;
    }

    const loadPdf = async () => {
      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: false
        });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setError(null);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  // Save progress when page changes
  useEffect(() => {
    if (bookId && currentPage > 0 && totalPages > 0) {
      // Save to localStorage
      setBookProgress(bookId, currentPage, totalPages);
      
      // Save to backend
      axios.post(`http://127.0.0.1:5000/api/books/${bookId}/progress`, {
        current_page: currentPage,
        total_pages: totalPages
      }).catch(err => console.error("Failed to save progress:", err));
    }
  }, [bookId, currentPage, totalPages]);

  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, layout]);

  const renderPage = async (pageNum) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    }
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleScaleChange = (delta) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleLayoutChange = () => {
    const layouts = ["single", "double", "continuous"];
    const currentIndex = layouts.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setLayout(layouts[nextIndex]);
  };

  const handleAddNote = () => {
    if (noteText.trim() && selectedText.trim()) {
      const newNote = {
        page: currentPage,
        text: noteText,
        selectedText: selectedText
      };
      addBookNote(bookId, newNote);
      setNotes([...notes, { ...newNote, id: Date.now().toString(), created_at: new Date().toISOString() }]);
      setNoteText("");
      setSelectedText("");
      setShowNoteInput(false);
    }
  };

  const handleAddHighlight = () => {
    if (selectedText.trim()) {
      const newHighlight = {
        page: currentPage,
        text: selectedText,
        color: "#ffff00"
      };
      addBookHighlight(bookId, newHighlight);
      setHighlights([...highlights, { ...newHighlight, id: Date.now().toString(), created_at: new Date().toISOString() }]);
      setSelectedText("");
    }
  };

  // Get selected text
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const pageStyle = {
    minHeight: "100vh",
    background: "#f5f5f5",
    display: "flex",
    flexDirection: "column"
  };

  const navBarStyle = {
    background: "#ffffff",
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 100
  };

  const navButtonStyle = {
    background: "transparent",
    border: "none",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "background 0.2s"
  };

  const iconButtonStyle = {
    ...navButtonStyle,
    padding: "0.5rem",
    width: "40px",
    height: "40px",
    justifyContent: "center"
  };

  const readerContainerStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: layout === "continuous" ? "1rem" : "2rem",
    overflow: "auto",
    background: "#f5f5f5",
    position: "relative"
  };

  const canvasContainerStyle = {
    background: "#ffffff",
    padding: layout === "continuous" ? "1rem" : "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    maxWidth: "100%",
    marginBottom: layout === "continuous" ? "1rem" : "0"
  };

  const controlsStyle = {
    background: "#ffffff",
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    boxShadow: "0 -2px 4px rgba(0,0,0,0.1)"
  };

  const sliderStyle = {
    flex: 1,
    maxWidth: "400px",
    margin: "0 1rem"
  };

  const notesPanelStyle = {
    position: "fixed",
    right: showNotesPanel ? "0" : "-400px",
    top: "60px",
    width: "400px",
    height: "calc(100vh - 60px)",
    background: "#ffffff",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
    transition: "right 0.3s ease",
    zIndex: 99,
    overflowY: "auto",
    padding: "1.5rem"
  };

  if (loading) {
    return (
      <div style={{ ...pageStyle, justifyContent: "center", alignItems: "center" }}>
        <div className="spinner"></div>
        <p style={{ marginTop: "1rem", color: "#666" }}>Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...pageStyle, justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ marginBottom: "0.5rem" }}>Error</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>{error}</p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={pageStyle}>
      {/* Top Navigation Bar */}
      <div style={navBarStyle}>
        <button
          onClick={() => navigate("/")}
          style={navButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          ← Back
        </button>
        
        <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#333" }}>
          {title}
        </h2>
        
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={() => setShowNotesPanel(!showNotesPanel)}
            style={{
              ...iconButtonStyle,
              background: showNotesPanel ? "#e0e0f0" : "transparent"
            }}
            title="Notes/Highlights"
            onMouseEnter={(e) => !showNotesPanel && (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) => !showNotesPanel && (e.currentTarget.style.background = "transparent")}
          >
            📝
          </button>
          <button
            onClick={handleLayoutChange}
            style={iconButtonStyle}
            title={`Layout: ${layout}`}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {layout === "single" ? "📄" : layout === "double" ? "📑" : "📜"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <button
              onClick={() => handleScaleChange(-0.1)}
              style={{ ...iconButtonStyle, fontSize: "0.875rem" }}
              title="Decrease Size"
            >
              A-
            </button>
            <span style={{ fontSize: "0.875rem", color: "#666", minWidth: "40px", textAlign: "center" }}>
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => handleScaleChange(0.1)}
              style={{ ...iconButtonStyle, fontSize: "0.875rem" }}
              title="Increase Size"
            >
              A+
            </button>
          </div>
          <button
            onClick={toggleFullscreen}
            style={iconButtonStyle}
            title="Fullscreen"
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Notes Panel */}
      <div ref={notesPanelRef} style={notesPanelStyle}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>Notes & Highlights</h3>
          
          {selectedText && (
            <div style={{
              padding: "0.75rem",
              background: "#f5f5f5",
              borderRadius: "0.5rem",
              marginBottom: "1rem"
            }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#666" }}>Selected:</p>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>"{selectedText}"</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  onClick={handleAddHighlight}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#fbbf24",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Highlight
                </button>
                <button
                  onClick={() => setShowNoteInput(true)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Add Note
                </button>
              </div>
            </div>
          )}

          {showNoteInput && (
            <div style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "0.5rem",
              marginBottom: "1rem"
            }}>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note..."
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem"
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={handleAddNote}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setNoteText("");
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#e5e7eb",
                    color: "#333",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem" }}>Highlights ({highlights.length})</h4>
            {highlights.length === 0 ? (
              <p style={{ color: "#999", fontSize: "0.875rem" }}>No highlights yet</p>
            ) : (
              highlights.map((highlight) => (
                <div key={highlight.id} style={{
                  padding: "0.75rem",
                  background: "#fff9c4",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem",
                  borderLeft: "3px solid #fbbf24"
                }}>
                  <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.75rem", color: "#666" }}>
                    Page {highlight.page}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>"{highlight.text}"</p>
                </div>
              ))
            )}
          </div>

          <div>
            <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem" }}>Notes ({notes.length})</h4>
            {notes.length === 0 ? (
              <p style={{ color: "#999", fontSize: "0.875rem" }}>No notes yet</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} style={{
                  padding: "0.75rem",
                  background: "#f9fafb",
                  borderRadius: "0.25rem",
                  marginBottom: "0.5rem",
                  borderLeft: "3px solid #6366f1"
                }}>
                  <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.75rem", color: "#666" }}>
                    Page {note.page}
                  </p>
                  {note.selectedText && (
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontStyle: "italic", color: "#666" }}>
                      "{note.selectedText}"
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{note.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PDF Canvas */}
      <div style={readerContainerStyle}>
        <div style={canvasContainerStyle}>
          <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={controlsStyle}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          style={{
            ...navButtonStyle,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? "not-allowed" : "pointer"
          }}
        >
          ← Previous
        </button>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#666", fontSize: "0.875rem" }}>
            Page {currentPage} of {totalPages}
          </span>
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value))}
            style={sliderStyle}
          />
          <span style={{ color: "#666", fontSize: "0.875rem", minWidth: "60px" }}>
            {totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0}%
          </span>
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          style={{
            ...navButtonStyle,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? "not-allowed" : "pointer"
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
