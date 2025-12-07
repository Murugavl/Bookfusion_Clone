import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get("http://127.0.0.1:5000/api/books/all")
      .then(res => {
        setBooks(res.data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load books. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleBookClick = (book) => {
    const pdfUrl = encodeURIComponent(book.file_url);
    const title = encodeURIComponent(book.title);
    navigate(`/reader/${book._id}?pdfUrl=${pdfUrl}&title=${title}`);
  };

  const pageStyle = {
    minHeight: "100vh",
    background: "#131313",
    color: "#ffffff",
    display: "flex"
  };

  const sidebarStyle = {
    width: "250px",
    background: "#1a1a1a",
    padding: "2rem 1.5rem",
    borderRight: "1px solid #2a2a2a",
    minHeight: "100vh"
  };

  const sidebarItemStyle = {
    padding: "0.75rem 1rem",
    marginBottom: "0.5rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#e0e0e0",
    fontSize: "0.95rem"
  };

  const mainContentStyle = {
    flex: 1,
    padding: "2rem 3rem",
    overflow: "auto"
  };

  const headerStyle = {
    marginBottom: "2rem"
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "1rem"
  };

  const tabsStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    borderBottom: "1px solid #2a2a2a",
    paddingBottom: "1rem"
  };

  const tabStyle = (isActive) => ({
    padding: "0.75rem 1.5rem",
    background: isActive ? "#6366f1" : "transparent",
    color: isActive ? "#ffffff" : "#a0a0a0",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: isActive ? 600 : 500,
    transition: "all 0.2s ease"
  });

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "1.5rem"
  };

  const cardStyle = {
    background: "#1a1a1a",
    borderRadius: "0.75rem",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #2a2a2a"
  };

  const coverStyle = {
    width: "100%",
    height: "260px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
    position: "relative",
    overflow: "hidden"
  };

  const cardInfoStyle = {
    padding: "1rem",
    background: "#1a1a1a"
  };

  const bookTitleStyle = {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#ffffff",
    margin: "0 0 0.5rem 0",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  };

  const authorStyle = {
    fontSize: "0.85rem",
    color: "#a0a0a0",
    margin: 0
  };

  const loadingStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "1rem"
  };

  const emptyStateStyle = {
    textAlign: "center",
    padding: "4rem 2rem",
    color: "#a0a0a0"
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={loadingStyle}>
            <div className="spinner" style={{ borderTopColor: "#6366f1" }}></div>
            <p style={{ color: "#a0a0a0" }}>Loading your library...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={loadingStyle}>
            <div style={{ fontSize: "3rem" }}>⚠️</div>
            <h2 style={{ margin: 0 }}>Error</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#6366f1",
                color: "white",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navigation />
      
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3 style={{ 
          color: "#ffffff", 
          fontSize: "1.125rem", 
          marginBottom: "1.5rem",
          fontWeight: 600
        }}>
          Library
        </h3>
        {["📊 Reading Time", "📚 All Content", "📖 Series", "⭐ Highlights", "💬 Reviews", "📱 Send to Kindle"].map((item, index) => (
          <div
            key={index}
            style={sidebarItemStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#2a2a2a";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#e0e0e0";
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>My Shelf</h1>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <button
            onClick={() => setActiveTab("All")}
            style={tabStyle(activeTab === "All")}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("Favorites")}
            style={tabStyle(activeTab === "Favorites")}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab("Plan to Read")}
            style={tabStyle(activeTab === "Plan to Read")}
          >
            Plan to Read
          </button>
          <button
            onClick={() => setActiveTab("Completed")}
            style={tabStyle(activeTab === "Completed")}
          >
            Completed
          </button>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📚</div>
            <h2 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
              Your shelf is empty
            </h2>
            <p>
              Upload your first book to get started
            </p>
          </div>
        ) : (
          <div style={gridStyle}>
            {books.map((book) => (
              <div
                key={book._id}
                className="book-card"
                style={cardStyle}
                onClick={() => handleBookClick(book)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={coverStyle}>
                  📖
                </div>
                <div style={cardInfoStyle}>
                  <h3 style={bookTitleStyle}>{book.title}</h3>
                  <p style={authorStyle}>Author Name</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
