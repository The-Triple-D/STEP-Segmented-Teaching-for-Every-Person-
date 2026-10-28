const pageNames = {
  today: ["My learning", "Today"],
  course: ["My learning", "My course"],
  lesson: ["My learning", "Lesson player"],
  checkin: ["My learning", "Quick check-in"],
  pdf: ["My learning", "Study cards"],
  progress: ["My learning", "My progress"],
  settings: ["My learning", "My preferences"],
  upload: ["Instructor workspace", "Upload content"],
  insights: ["Instructor workspace", "Course insights"]
};

export default function Topbar({ view, onNavigate }) {
  const [parent, current] = pageNames[view] || pageNames.today;
  return (
    <header className="topbar">
      <div className="crumb"><span>{parent} / </span><strong>{current}</strong></div>
      <div className="top-actions">
        <button className="quiet-button" type="button" onClick={() => onNavigate("settings")}>Aa Display</button>
        <span className="status done">Saved locally</span>
        <span className="small-user">Jordan Lee <span className="avatar" aria-hidden="true">J</span></span>
      </div>
    </header>
  );
}
