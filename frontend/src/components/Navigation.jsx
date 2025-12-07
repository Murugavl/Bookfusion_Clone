import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navStyle = {
    background: "var(--bg-primary)",
    borderBottom: "1px solid var(--border-color)",
    padding: "1rem 0",
    boxShadow: "var(--shadow-sm)",
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
    color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
    fontWeight: isActive ? 600 : 500,
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    transition: "all 0.2s ease",
    backgroundColor: isActive ? "rgba(99, 102, 241, 0.1)" : "transparent"
  });

  const buttonStyle = {
    padding: "0.625rem 1.25rem",
    backgroundColor: "var(--primary-color)",
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
          📚 BookFusion
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

