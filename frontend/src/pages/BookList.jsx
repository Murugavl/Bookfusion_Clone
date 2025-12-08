import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBookStatus, setBookStatus } from "../utils/bookStorage";
import { useBooks } from "../hooks/useBooks";
import { useDebounce } from "../hooks/useDebounce";
import { bookService } from "../services/api";

export default function BookList() {
  const { books, loading, error, setBooks } = useBooks();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSidebarItem, setActiveSidebarItem] = useState(null);
  const navigate = useNavigate();
  
  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleStatusChange = async (bookId, newStatus) => {
    // Update local storage
    setBookStatus(bookId, newStatus);
    
    // Update backend
    try {
      await bookService.update(bookId, { status: newStatus });
      
      // Update local state
      setBooks(books.map(book => 
        book._id === bookId ? { ...book, status: newStatus } : book
      ));
    } catch (err) {
      console.error("Failed to update book status:", err);
      // Revert local storage change on error
      setBookStatus(bookId, books.find(b => b._id === bookId)?.status || "All");
    }
  };

  const handleBookClick = (book) => {
    const pdfUrl = encodeURIComponent(book.file_url);
    const title = encodeURIComponent(book.title);
    navigate(`/reader/${book._id}?pdfUrl=${pdfUrl}&title=${title}`);
  };

  // Filter books based on active tab and search query
  const filteredBooks = useMemo(() => {
    let filtered = [...books];

    // Apply search filter (using debounced query)
    if (debouncedSearchQuery.trim()) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      );
    }

    // Apply tab filter
    if (activeTab !== "All") {
      filtered = filtered.filter(book => {
        const bookStatus = book.status || getBookStatus(book._id);
        return bookStatus === activeTab;
      });
    }

    return filtered;
  }, [books, activeTab, debouncedSearchQuery]);

  const pageStyle = {
    minHeight: "100vh",
    background: "#0D0D0D",
    color: "#FFFFFF",
    position: "relative"
  };

  const sidebarStyle = {
    width: "260px",
    background: "#111111",
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    padding: "24px",
    overflowY: "auto",
    zIndex: 10
  };

  const sidebarItemStyle = {
    padding: "0.75rem 1rem",
    marginBottom: "18px",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    color: "#e0e0e0",
    fontSize: "0.95rem"
  };

  const mainContentStyle = {
    marginLeft: "260px",
    maxWidth: "1200px",
    padding: "32px",
    minHeight: "100vh"
  };

  const headerStyle = {
    marginBottom: "24px"
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: 700,
    color: "#FFFFFF",
    marginBottom: "8px",
    lineHeight: "1.2"
  };

  const bookCountStyle = {
    fontSize: "0.875rem",
    color: "#a0a0a0",
    marginBottom: "24px"
  };

  const tabsStyle = {
    display: "flex",
    gap: "24px",
    marginBottom: "24px"
  };

  const tabStyle = (isActive) => ({
    padding: "0.75rem 1.5rem",
    background: isActive ? "#6366f1" : "#1a1a1a",
    color: isActive ? "#FFFFFF" : "#a0a0a0",
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
    gap: "24px"
  };

  const searchInputStyle = {
    width: "400px",
    padding: "0.75rem 1rem",
    background: "#1E1E1E",
    border: "1px solid #2a2a2a",
    borderRadius: "0.5rem",
    color: "#FFFFFF",
    fontSize: "0.95rem",
    marginBottom: "24px",
    outline: "none",
    transition: "all 0.2s ease"
  };

  const cardStyle = {
    width: "180px",
    background: "transparent",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    margin: "0"
  };

  // Generate gradient based on book title for variety
  const getCoverStyle = (book) => {
    // If cover_url exists, use it
    if (book.cover_url) {
      return {
        width: "100%",
        height: "240px",
        backgroundImage: `url(${book.cover_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "4rem",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px 12px 0 0"
      };
    }
    
    // Otherwise use gradient
    const gradients = [
      "linear-gradient(135deg, #6366f1, #8b5cf6)",
      "linear-gradient(135deg, #8b5cf6, #ec4899)",
      "linear-gradient(135deg, #ec4899, #f59e0b)",
      "linear-gradient(135deg, #f59e0b, #10b981)",
      "linear-gradient(135deg, #10b981, #06b6d4)",
      "linear-gradient(135deg, #06b6d4, #6366f1)"
    ];
    const index = book.title.length % gradients.length;
    return {
      width: "100%",
      height: "240px",
      background: gradients[index],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "4rem",
      position: "relative",
      overflow: "hidden",
      borderRadius: "12px 12px 0 0"
    };
  };

  const cardInfoStyle = {
    padding: "12px 0 0 0",
    background: "transparent"
  };

  const bookTitleStyle = {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#FFFFFF",
    margin: "0 0 4px 0",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  };

  const authorStyle = {
    fontSize: "0.85rem",
    color: "#a0a0a0",
    margin: "0 0 8px 0"
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
        <div style={sidebarStyle}>
          <h3 style={{ 
            color: "#FFFFFF", 
            fontSize: "1.125rem", 
            marginBottom: "24px",
            fontWeight: 700
          }}>
            Library
          </h3>
        </div>
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
        <div style={sidebarStyle}>
          <h3 style={{ 
            color: "#FFFFFF", 
            fontSize: "1.125rem", 
            marginBottom: "24px",
            fontWeight: 700
          }}>
            Library
          </h3>
        </div>
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
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3 style={{ 
          color: "#FFFFFF", 
          fontSize: "1.125rem", 
          marginBottom: "24px",
          fontWeight: 700
        }}>
          Library
        </h3>
        {[
          { icon: "📊", label: "Reading Time", action: () => setActiveSidebarItem("reading-time") },
          { icon: "📚", label: "All Content", action: () => setActiveSidebarItem("all-content") },
          { icon: "📖", label: "Series", action: () => setActiveSidebarItem("series") },
          { icon: "⭐", label: "Highlights", action: () => setActiveSidebarItem("highlights") },
          { icon: "💬", label: "Reviews", action: () => setActiveSidebarItem("reviews") },
          { icon: "📱", label: "Send to Kindle", action: () => setActiveSidebarItem("kindle") }
        ].map((item, index) => (
          <div
            key={index}
            style={{
              ...sidebarItemStyle,
              background: activeSidebarItem === item.label.toLowerCase().replace(/\s+/g, '-') ? "#2a2a2a" : "transparent",
              color: activeSidebarItem === item.label.toLowerCase().replace(/\s+/g, '-') ? "#ffffff" : "#e0e0e0"
            }}
            onClick={item.action}
            onMouseEnter={(e) => {
              if (activeSidebarItem !== item.label.toLowerCase().replace(/\s+/g, '-')) {
                e.currentTarget.style.background = "#2a2a2a";
                e.currentTarget.style.color = "#ffffff";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSidebarItem !== item.label.toLowerCase().replace(/\s+/g, '-')) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#e0e0e0";
              }
            }}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>My Shelf</h1>
          <p style={bookCountStyle}>
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
            {searchQuery && ` • Searching: "${searchQuery}"`}
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.background = "#2a2a2a";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.background = "#1E1E1E";
          }}
        />

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
        ) : filteredBooks.length === 0 ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
              No books found
            </h2>
            <p>
              {searchQuery 
                ? `No books match "${searchQuery}"`
                : `No books in "${activeTab}" category`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 1.5rem",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div style={gridStyle}>
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="book-card"
                style={cardStyle}
                onClick={() => handleBookClick(book)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={getCoverStyle(book)}>
                  {!book.cover_url && "📖"}
                </div>
                <div style={cardInfoStyle}>
                  <h3 style={bookTitleStyle}>{book.title}</h3>
                  <p style={authorStyle}>
                    {book.author || "Unknown Author"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
