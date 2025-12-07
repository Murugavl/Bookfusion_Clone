import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navStyle = {
    background: "#1a1a1a",
    borderBottom: "1px solid #2a2a2a",
    padding: "1rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  };

  const navLinksStyle = {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center"
  };

  const linkStyle = (isActive) => ({
    color: isActive ? "#6366f1" : "#e0e0e0",
    fontWeight: isActive ? 600 : 500,
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    transition: "all 0.2s ease",
    backgroundColor: isActive ? "rgba(99, 102, 241, 0.2)" : "transparent"
  });

  const buttonStyle = {
    padding: "0.625rem 1.25rem",
    backgroundColor: "#6366f1",
    color: "white",
    borderRadius: "0.5rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    border: "none",
    cursor: "pointer"
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          📚 Vel's BookCloud
        </Link>
        <div style={navLinksStyle}>
          <Link 
            to="/" 
            style={linkStyle(location.pathname === "/")}
          >
            Library
          </Link>
          <Link 
            to="/upload" 
            style={{
              ...buttonStyle,
              ...linkStyle(location.pathname === "/upload")
            }}
          >
            + Upload Book
          </Link>
        </div>
      </div>
    </nav>
  );
}

