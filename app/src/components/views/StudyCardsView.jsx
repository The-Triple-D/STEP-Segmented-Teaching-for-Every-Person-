export default function StudyCardsView({
  documentLessons, activeLesson, segmentIndex, progress,
  cardAnswerVisible, onOpenLesson, onCardPrevious, onCardNext, onCardAnswerToggle,
  onNavigate
}) {
  const lesson = ["pdf", "pptx"].includes(activeLesson?.kind)
    ? activeLesson
    : documentLessons[0];
  if (!lesson || !lesson.segments.length) {
    return (
      <>
        <div className="page-head"><div><p className="eyebrow">Reading, in smaller pieces</p><h1 id="pdf-title">Study cards</h1><p className="lede">Upload a PDF or PowerPoint to create study cards from its text.</p></div></div>
        <button className="primary" type="button" onClick={() => onNavigate("upload")}>Upload reading <span aria-hidden="true">→</span></button>
      </>
    );
  }
  const index = lesson.id === activeLesson?.id ? segmentIndex : 0;
  const segment = lesson.segments[index] || lesson.segments[0];
  const activeProgress = progress.find(item => item.lessonId === lesson.id && item.segmentIndex === index);
  const sourceLabel = segment.sourceLabel || (lesson.kind === "pptx" ? `Slide ${index + 1}` : `PDF page ${index + 1}`);
  const detail = segment.sourceText || segment.transcript || segment.summary || "No extracted source text is available.";

  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">Reading, in smaller pieces</p><h1 id="pdf-title">{lesson.title}</h1><p className="lede">Key points from your course reading. One card at a time.</p></div>
        <span className="status">About {segment.minutes || 2} min</span>
      </div>
      {documentLessons.length > 1 && (
        <label className="card-lesson-picker">Choose reading
          <select value={lesson.id} onChange={event => {
            const next = documentLessons.find(item => item.id === event.target.value);
            if (next) onOpenLesson(next, 0, "pdf");
          }}>
            {documentLessons.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}
          </select>
        </label>
      )}
      <div className="pdf-layout">
        <div>
          <article className="flash-card" aria-live="polite">
            <div className="card-count">CARD {index + 1} OF {lesson.segments.length} · {sourceLabel.toUpperCase()}</div>
            <div>
              <h2 id="card-heading">{segment.title}</h2>
              <p className="key-point" id="card-summary">{segment.summary || detail.slice(0, 360)}</p>
              <details className="details" id="card-details">
                <summary>Read full source from {sourceLabel.toLowerCase()}</summary>
                <p>{detail}</p>
              </details>
            </div>
            <div className="flash-controls">
              <button className="secondary" type="button" onClick={onCardPrevious} disabled={index === 0} aria-label="Previous card">← Previous</button>
              <span>{index + 1} / {lesson.segments.length}</span>
              <button className="secondary" type="button" onClick={onCardNext} disabled={index >= lesson.segments.length - 1}>Next card →</button>
            </div>
          </article>
        </div>
        <aside>
          <div className="flash-definition">
            <p className="eyebrow">Flashcard break</p>
            <h3 id="flash-question">{segment.question || "What is one idea you want to remember?"}</h3>
            <p>Try to recall it before checking.</p>
            <button className="secondary" type="button" aria-expanded={cardAnswerVisible} onClick={onCardAnswerToggle}>{cardAnswerVisible ? "Hide answer" : "Show answer"}</button>
            {cardAnswerVisible && <div className="flash-answer" id="flash-answer">{segment.answer || segment.explanation || segment.summary}</div>}
          </div>
          <div className="panel" style={{ marginTop: 14 }}>
            <h3>Reading options</h3>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>Switch to another lesson format whenever you like.</p>
            <button className="secondary" type="button" onClick={() => {
              if (lesson.id !== activeLesson?.id) onOpenLesson(lesson, index, "lesson");
              else onNavigate("lesson");
            }}>Open lesson formats</button>
          </div>
        </aside>
      </div>
      {Boolean(activeProgress?.completed) && <p className="status done">This card is marked complete.</p>}
    </>
  );
}
