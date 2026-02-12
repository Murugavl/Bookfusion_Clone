export default function BookCardMenu({ visible, onAction, position }) {
  if (!visible) return null;

  const menuStyle = {
    position: "absolute",
    top: position.top,
    left: position.left,
    background: "#1A1A1A",
    color: "#fff",
    padding: "12px",
    width: "240px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    zIndex: 2000,
  };

  const itemStyle = {
    padding: "10px 8px",
    cursor: "pointer",
    borderRadius: "6px",
    fontSize: "0.9rem",
  };

  const hoverOn = (e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)");
  const hoverOff = (e) => (e.currentTarget.style.background = "transparent");

  return (
    <div style={menuStyle}>
      <div
        style={itemStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={() => onAction("favorite")}
      >
        ❤️ Add to Favorites
      </div>

      <div
        style={itemStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={() => onAction("remove-current")}
      >
        📘 Remove from Currently Reading
      </div>

      <div
        style={itemStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={() => onAction("remove-plan")}
      >
        📖 Remove from Plan to Read
      </div>

      <div
        style={itemStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={() => onAction("completed")}
      >
        ✔ Move to Completed
      </div>

      <hr style={{ border: "1px solid rgba(255,255,255,0.1)" }} />

      <div
        style={itemStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={() => onAction("edit")}
      >
        ✏️ Edit
      </div>

      <div
        style={itemStyle}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={() => onAction("delete")}
      >
        🗑 Delete
      </div>
    </div>
  );
}
