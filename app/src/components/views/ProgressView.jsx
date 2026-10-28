function currentWeekActivity(progress) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const counts = Array(7).fill(0);
  for (const item of progress) {
    if (!item.completed || !item.updatedAt) continue;
    const date = new Date(item.updatedAt);
    const day = Math.floor((date - monday) / 86400000);
    if (day >= 0 && day < 7) counts[day] += 1;
  }
  return counts;
}

export default function ProgressView({ progress, lessons, completedSegments }) {
  const courses = new Set(lessons.map(lesson => lesson.course));
  const activity = currentWeekActivity(progress);
  const maximum = Math.max(1, ...activity);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <>
      <div className="page-head"><div><p className="eyebrow">Your learning, over time</p><h1 id="progress-title">Look how far you’ve come.</h1><p className="lede">A quiet record of the effort you put in. Every step counts.</p></div><span className="status done">This week</span></div>
      <div className="dashboard-grid">
        <article className="metric"><span className="metric-label">Segments completed</span><div className="metric-value">{completedSegments}</div><p className="metric-note">Across {courses.size} courses</p></article>
        <article className="metric"><span className="metric-label">Current streak</span><div className="metric-value">4 <span className="metric-unit">days</span></div><p className="metric-note">Welcome back whenever you’re ready.</p></article>
        <article className="metric"><span className="metric-label">Effort points</span><div className="metric-value">{completedSegments * 20}</div><p className="metric-note">Earned by showing up and trying</p></article>
      </div>
      <div className="dashboard-lower">
        <section className="panel">
          <h3>Your learning rhythm</h3>
          <p className="muted-copy">Segments completed each day this week · no targets to race</p>
          <div className="week-chart" role="img" aria-label={`Activity chart: ${days.map((day, index) => `${day} ${activity[index]}`).join(", ")}`}>
            {days.map((day, index) => <div className="day-bar" key={day}><i style={{ height: `${Math.max(4, activity[index] / maximum * 100)}%` }} />{day}</div>)}
          </div>
        </section>
        <section className="panel">
          <h3>Milestones</h3>
          <div className="badge-row"><span className="badge-icon" aria-hidden="true">✳</span><p><strong>First steps</strong><small>{completedSegments ? "Finished a learning segment" : "Your first completed segment is waiting"}</small></p></div>
          <div className="badge-row"><span className="badge-icon" aria-hidden="true">◷</span><p><strong>Finding a rhythm</strong><small>Keep coming back at your own pace</small></p></div>
          <div className="badge-row"><span className="badge-icon" aria-hidden="true">✦</span><p><strong>Curious mind</strong><small>Explore ideas across your courses</small></p></div>
        </section>
      </div>
    </>
  );
}
