const studentItems = [
  ["today", "⌂", "Today"],
  ["course", "▤", "My course"],
  ["lesson", "▷", "Lesson player"],
  ["pdf", "▧", "Study cards"],
  ["progress", "◷", "My progress"],
  ["settings", "⚙", "My preferences"]
];

export default function Sidebar({ view, onNavigate }) {
  const renderItems = items => items.map(([id, icon, label]) => (
    <button
      className="nav-button"
      type="button"
      key={id}
      aria-current={view === id ? "page" : undefined}
      onClick={() => onNavigate(id)}
    >
      <span className="nav-icon" aria-hidden="true">{icon}</span>{label}
    </button>
  ));

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <button className="brand" type="button" onClick={() => onNavigate("today")}>
        <span className="brand-mark" aria-hidden="true">S</span>
        <span><strong>STEP</strong><small>SEGMENTED TEACHING FOR EVERY PERSON</small></span>
      </button>
      <p className="nav-label">Your learning</p>
      <nav className="nav-list" aria-label="Student navigation">{renderItems(studentItems)}</nav>
      <p className="nav-label" style={{ marginTop: 24 }}>For instructors</p>
      <nav className="nav-list" aria-label="Instructor navigation">
        {renderItems([["upload", "＋", "Upload content"], ["insights", "⌁", "Course insights"]])}
      </nav>
      <div className="side-bottom">
        <div className="streak-mini"><span className="avatar" aria-hidden="true">J</span><span>Hi, Jordan<br /><b>4 days in a row</b></span></div>
      </div>
    </aside>
  );
}
