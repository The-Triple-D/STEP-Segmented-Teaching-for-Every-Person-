function formatDuration(minutes) {
  return `${Math.max(1, Number(minutes) || 5)} min`;
}

export default function TodayView({ lessons, progress, onNavigate, onOpenLesson }) {
  const next = lessons
    .map(lesson => ({
      lesson,
      index: lesson.segments.findIndex((segment, index) =>
        !progress.some(item => item.lessonId === lesson.id && item.segmentIndex === index && item.completed))
    }))
    .find(item => item.index >= 0);
  const resume = progress.find(item => item.position > 0 && !item.completed);
  const resumeLesson = lessons.find(lesson => lesson.id === resume?.lessonId);
  const resumeIndex = resumeLesson?.segments[resume?.segmentIndex] ? resume.segmentIndex : next?.index ?? 0;
  const date = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  const completed = progress.filter(item => item.completed).length;
  const weekTarget = Math.min(5, completed);
  const currentLesson = resumeLesson || next?.lesson || lessons[0];
  const currentIndex = resumeLesson ? resumeIndex : next?.index ?? 0;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{date}</p>
          <h1>A little progress is still progress.</h1>
          <p className="lede">{resumeLesson ? "Pick up right where you left off." : "You have a short lesson ready when you are."}</p>
        </div>
        <button className="primary" type="button" onClick={() => currentLesson && onOpenLesson(currentLesson, currentIndex, ["pdf", "pptx"].includes(currentLesson.kind) ? "pdf" : "lesson")}>
          {resumeLesson ? "Resume learning" : "Start learning"} <span aria-hidden="true">→</span>
        </button>
      </section>
      <div className="today-grid">
        <div>
          <div className="section-heading" style={{ marginTop: 0 }}>
            <h2>On your list today</h2>
            <button className="text-link" type="button" onClick={() => onNavigate("course")}>View course</button>
          </div>
          <div className="lesson-list">
            {lessons.slice(0, 4).map(lesson => {
              const nextSegment = lesson.segments.findIndex((segment, index) =>
                !progress.some(item => item.lessonId === lesson.id && item.segmentIndex === index && item.completed));
              const segment = lesson.segments[Math.max(0, nextSegment)];
              const hasProgress = progress.some(item => item.lessonId === lesson.id && item.position > 0 && !item.completed);
              return (
                <button className="lesson-row" type="button" key={lesson.id} onClick={() => onOpenLesson(lesson, Math.max(0, nextSegment), ["pdf", "pptx"].includes(lesson.kind) ? "pdf" : "lesson")}>
                  <span className="lesson-art" aria-hidden="true">{lesson.kind === "pdf" || lesson.kind === "pptx" ? "▧" : "◉"}</span>
                  <span><strong>{lesson.title}{segment ? ` · ${segment.title}` : ""}</strong><small>{lesson.course} · {hasProgress ? "In progress" : "Ready to begin"}</small></span>
                  <span className="duration">{formatDuration(segment?.minutes)}</span>
                </button>
              );
            })}
            {!lessons.length && <p className="empty-state">Your instructor has not added any lessons yet.</p>}
          </div>
        </div>
        <aside className="summary-panel" aria-label="Weekly progress">
          <h3>Your week, at a glance</h3>
          <p>Steady steps add up. Every completed segment counts.</p>
          <div className="streak-count">{completed} <span>segments completed</span></div>
          <div className="mini-progress" role="progressbar" aria-label="Weekly lessons completed" aria-valuenow={weekTarget} aria-valuemin="0" aria-valuemax="5"><span style={{ width: `${weekTarget * 20}%` }} /></div>
          <p className="progress-note">{weekTarget} of 5 weekly steps</p>
          <div className="week-dots" aria-label="Weekly activity">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span className={index < weekTarget ? "on" : ""} key={`${day}-${index}`}>{day}</span>)}
          </div>
        </aside>
      </div>
      <div className="section-heading"><h2>Pick a gentle reset</h2></div>
      <button className="secondary" type="button" onClick={() => onNavigate("pdf")}>Review a study card <span aria-hidden="true">→</span></button>
    </>
  );
}
