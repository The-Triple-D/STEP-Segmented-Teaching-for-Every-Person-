const items = [
  ["today", "⌂", "Today"],
  ["course", "▤", "Course"],
  ["lesson", "▷", "Lesson"],
  ["pdf", "▧", "Cards"],
  ["settings", "⚙", "Settings"],
  ["upload", "＋", "Teach"],
  ["insights", "⌁", "Insights"]
];

export default function MobileNavigation({ view, onNavigate }) {
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {items.map(([id, icon, label]) => (
        <button
          key={id}
          type="button"
          className="nav-button"
          aria-current={view === id ? "page" : undefined}
          onClick={() => onNavigate(id)}
        >
          <span className="nav-icon" aria-hidden="true">{icon}</span>{label}
        </button>
      ))}
    </nav>
  );
}
