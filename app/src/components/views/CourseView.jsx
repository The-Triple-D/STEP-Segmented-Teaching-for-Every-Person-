function percentForLesson(lesson, progress) {
  const completed = lesson.segments.filter((segment, index) =>
    progress.some(item => item.lessonId === lesson.id && item.segmentIndex === index && item.completed)).length;
  return lesson.segments.length ? Math.round((completed / lesson.segments.length) * 100) : 0;
}

export default function CourseView({ lessons, progress, onNavigate, onOpenLesson, onReviewLesson, onDeleteLesson }) {
  const courseName = lessons[0]?.course || "Your courses";
  const total = lessons.reduce((count, lesson) => count + lesson.segments.length, 0);
  const done = progress.filter(item => item.completed).length;

  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">Your course</p><h1 id="course-title">{courseName}</h1><p className="lede">Small, focused lessons to help big ideas stick.</p></div>
        <button className="secondary" type="button" onClick={() => onNavigate("progress")}>View progress</button>
      </div>
      <div className="course-banner">
        <div className="course-title"><span className="course-icon" aria-hidden="true">▤</span><div><h2>{lessons.length ? `${lessons.length} learning materials` : "No materials yet"}</h2><p>{total} short segments across your courses</p></div></div>
        <div className="progress-inline">
          <div><span>Course progress</span><strong>{done} of {total}</strong></div>
          <div className="bar" role="progressbar" aria-label="Course progress" aria-valuenow={total ? Math.round(done / total * 100) : 0} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${total ? Math.round(done / total * 100) : 0}%` }} />
          </div>
        </div>
      </div>
      <div className="segment-list" aria-label="Course lessons">
        {lessons.map(lesson => {
          const percent = percentForLesson(lesson, progress);
          return (
            <article className="lesson-course-card" key={lesson.id}>
              <div className="course-title">
                <span className="course-icon" aria-hidden="true">{lesson.kind === "pdf" || lesson.kind === "pptx" ? "▧" : "◉"}</span>
                <div><h2>{lesson.title}</h2><p>{lesson.course} · {lesson.segments.length} segments · {lesson.kind.toUpperCase()}</p></div>
              </div>
              <div className="bar" role="progressbar" aria-label={`${lesson.title} progress`} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${percent}%` }} /></div>
              <div className="lesson-course-actions">
                <span className={`status${percent === 100 ? " done" : " progress"}`}>{percent === 100 ? "Complete" : `${percent}% complete`}</span>
                {lesson.kind === "pdf" || lesson.kind === "pptx"
                  ? <button className="secondary" type="button" onClick={() => onOpenLesson(lesson, 0, "pdf")}>Open study cards</button>
                  : <button className="secondary" type="button" onClick={() => onOpenLesson(lesson, 0)}>Open lesson</button>}
                {lesson.id !== "demo-memory" && <button className="text-link" type="button" onClick={() => onReviewLesson(lesson)}>Edit lesson</button>}
                {lesson.id !== "demo-memory" && <button className="text-link danger-link" type="button" onClick={() => onDeleteLesson(lesson)}>Delete</button>}
              </div>
            </article>
          );
        })}
        {!lessons.length && <p className="empty-state">No course materials are available yet.</p>}
      </div>
      <div className="section-heading"><h2>Need to add material?</h2></div>
      <button className="secondary" type="button" onClick={() => onNavigate("upload")}>Open instructor workspace</button>
    </>
  );
}
