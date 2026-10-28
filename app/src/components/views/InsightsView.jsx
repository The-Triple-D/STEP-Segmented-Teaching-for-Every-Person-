export default function InsightsView({ lessons, progress, completedSegments }) {
  const lessonCount = lessons.length;
  const totalSegments = lessons.reduce((count, lesson) => count + lesson.segments.length, 0);
  const completionRate = totalSegments ? Math.round(completedSegments / totalSegments * 100) : 0;
  const completedLessons = lessons.filter(lesson =>
    lesson.segments.length > 0 && lesson.segments.every((segment, index) =>
      progress.some(item => item.lessonId === lesson.id && item.segmentIndex === index && item.completed))).length;
  return (
    <>
      <div className="page-head"><div><p className="eyebrow">Instructor workspace</p><h1 id="insights-title">Course insights</h1><p className="lede">A local overview of lesson materials and completion. No student accounts or remote analytics are connected in this prototype.</p></div><span className="status">Saved locally</span></div>
      <div className="dashboard-grid">
        <article className="metric"><span className="metric-label">Learning materials</span><div className="metric-value">{lessonCount}</div><p className="metric-note">Available on this device</p></article>
        <article className="metric"><span className="metric-label">Segments completed</span><div className="metric-value">{completedSegments}</div><p className="metric-note">Across {totalSegments} available segments</p></article>
        <article className="metric"><span className="metric-label">Overall completion</span><div className="metric-value">{completionRate}%</div><p className="metric-note">Completed segments so far</p></article>
      </div>
      <div className="dashboard-lower">
        <section className="panel"><h3>Material overview</h3><div className="insight-list">
          {lessons.map(lesson => {
            const done = progress.filter(item => item.lessonId === lesson.id && item.completed).length;
            return <div className="insight-row" key={lesson.id}><strong>{lesson.title}</strong><span>{done} / {lesson.segments.length} segments complete</span></div>;
          })}
          {!lessonCount && <p>No materials have been added.</p>}
        </div></section>
        <section className="panel"><h3>Student privacy comes first</h3><p className="muted-copy">This single-device prototype stores lesson content and progress in a local SQLite database. It does not collect class-wide or remote student analytics.</p><div className="metric-value">{completedLessons}</div><p className="metric-note">Materials with every segment completed</p></section>
      </div>
    </>
  );
}
