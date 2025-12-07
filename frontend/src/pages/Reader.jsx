import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

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
  const [fontSize, setFontSize] = useState(16);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
        setCurrentPage(1);
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

  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale]);

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
    padding: "2rem",
    overflow: "auto",
    background: "#f5f5f5"
  };

  const canvasContainerStyle = {
    background: "#ffffff",
    padding: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    maxWidth: "100%"
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
            style={iconButtonStyle}
            title="Notes/Highlights"
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            📝
          </button>
          <button
            style={iconButtonStyle}
            title="Layout"
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            ⚙️
          </button>
          <button
            onClick={() => handleScaleChange(0.1)}
            style={iconButtonStyle}
            title="Font Size"
            onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            A+
          </button>
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

