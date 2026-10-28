function sourceLabel(segment, lesson) {
  if (segment.sourceLabel) return segment.sourceLabel;
  if (lesson.kind === "pptx") return `Slide ${segment.index + 1}`;
  if (lesson.kind === "pdf") return "Extracted source text";
  return "Transcript excerpt";
}

export default function UploadView(props) {
  const {
    lessons, uploadFile, captionFile, uploadTitle, uploadCourse, transcriptDraft,
    editingLesson, editedSegments, uploadBusy, uploadStatus, onFileSelection,
    onCaptionSelection, onUploadTitleChange, onUploadCourseChange, onTranscriptChange,
    onUploadSubmit, onSaveDraft, onGenerateSuggestions, onAddSegment, onUpdateSegment,
    onReviewLesson, onDeleteLesson, onNavigate
  } = props;
  const videoLesson = editingLesson?.kind === "video";
  const documentLesson = editingLesson && ["pdf", "pptx"].includes(editingLesson.kind);
  return (
    <>
      <div className="page-head">
        <div><p className="eyebrow">Instructor workspace</p><h1 id="upload-title">Make a lesson in smaller steps.</h1><p className="lede">Add a lecture or reading. Review suggested short segments and a check-in question for each one.</p></div>
        <span className="status">Instructor tools</span>
      </div>
      <form className="upload-zone" onSubmit={onUploadSubmit}>
        <span className="course-icon" aria-hidden="true">↥</span>
        <strong>Add a PDF, PowerPoint, or video</strong>
        <p>Files are stored locally on this device. Video captions or transcripts are needed for accurate segment suggestions.</p>
        <label htmlFor="file-upload">Choose material</label>
        <input id="file-upload" type="file" accept="video/*,.pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={event => onFileSelection(event.target.files?.[0] || null)} />
        <label htmlFor="upload-title-input">Lesson title</label>
        <input id="upload-title-input" type="text" value={uploadTitle} placeholder="e.g. How Memory Works" onChange={event => onUploadTitleChange(event.target.value)} />
        <label htmlFor="upload-course-input">Course name</label>
        <input id="upload-course-input" type="text" value={uploadCourse} onChange={event => onUploadCourseChange(event.target.value)} />
        <label htmlFor="caption-upload">Video captions / transcript file (optional)</label>
        <input id="caption-upload" type="file" accept=".vtt,.srt,.txt,text/vtt,text/plain" onChange={event => onCaptionSelection(event.target.files?.[0] || null)} />
        <p id="caption-hint" className="muted-copy">PDF and PowerPoint text is extracted locally. For videos, attach a .vtt/.srt file or paste a transcript below.</p>
        <label htmlFor="transcript-input">Paste a transcript (optional)</label>
        <textarea id="transcript-input" rows="4" value={transcriptDraft} onChange={event => onTranscriptChange(event.target.value)} placeholder="Paste transcript text here." />
        <button className="primary upload-submit" type="submit" disabled={!uploadFile || uploadBusy}>{uploadBusy ? "Working…" : "Submit material"}</button>
        <p id="file-status" className="upload-status" role="status" aria-live="polite">{uploadStatus || (uploadFile ? `${uploadFile.name} selected.` : "Choose a PDF, PowerPoint, or video to begin.")}</p>
        {captionFile && <p className="status done">Caption file selected: {captionFile.name}</p>}
      </form>

      {editingLesson && (
        <section className="upload-review" aria-labelledby="review-title">
          <div className="page-head">
            <div><p className="eyebrow">Review suggestions</p><h2 id="review-title">{editingLesson.title}</h2><p className="lede">{editingLesson.kind === "video" ? "Check each segment and its question before saving." : "Source text is shown with each suggested study card."}</p></div>
            <button className="text-link" type="button" onClick={() => onNavigate("course")}>Preview student view</button>
          </div>
          {videoLesson && (
            <p className="empty-state" role="status">
              {editingLesson.needsTranscript
                ? "Video saved. Add captions or transcript text to generate searchable content and timed segment suggestions."
                : `${editingLesson.segments.length} transcript-based segment suggestions are ready to review.`}
            </p>
          )}
          {documentLesson && <p className="empty-state" role="status">{editingLesson.kind === "pptx" ? "PowerPoint slides extracted." : "PDF text extracted."} Source text is shown on each card.</p>}
          {(videoLesson || documentLesson) && (
            <button className="secondary" type="button" onClick={onGenerateSuggestions} disabled={uploadBusy || (videoLesson && !captionFile && !transcriptDraft.trim())}>
              {uploadBusy ? "Preparing suggestions…" : documentLesson ? "Regenerate study cards from saved file" : "Generate segment suggestions"}
            </button>
          )}
          <form onSubmit={onSaveDraft}>
            <div className="edit-lesson-heading">
              <label>Lesson title<input value={uploadTitle} onChange={event => onUploadTitleChange(event.target.value)} required /></label>
              <label>Course name<input value={uploadCourse} onChange={event => onUploadCourseChange(event.target.value)} /></label>
            </div>
            <div className="edit-segments" id="edit-segments">
              {editedSegments.map((segment, index) => {
                const sourceText = segment.sourceText || segment.transcript || segment.summary || "No source text was extracted for this segment.";
                return (
                  <article className="segment-review" key={`${editingLesson.id}-${index}`}>
                    <h3 className="segment-review-heading">Segment {index + 1}</h3>
                    <div className="segment-source">
                      <span className="segment-source-label">{sourceLabel({ ...segment, index }, editingLesson)}</span>
                      <p>{sourceText.length > 720 ? `${sourceText.slice(0, 720).trimEnd()}…` : sourceText}</p>
                      {sourceText.length > 720 && <details><summary>Show full source text</summary><p>{sourceText}</p></details>}
                    </div>
                    <div className="edit-row">
                      <label>Segment title<input value={segment.title || ""} onChange={event => onUpdateSegment(index, "title", event.target.value)} /></label>
                      <label>Estimated minutes<input type="number" min="1" value={segment.minutes ?? 5} onChange={event => onUpdateSegment(index, "minutes", event.target.value)} /></label>
                      <label>Start time (seconds)<input type="number" min="0" value={segment.startSeconds ?? ""} onChange={event => onUpdateSegment(index, "startSeconds", event.target.value)} /></label>
                      <label>End time (seconds)<input type="number" min="0" value={segment.endSeconds ?? ""} onChange={event => onUpdateSegment(index, "endSeconds", event.target.value)} /></label>
                      <label className="question-input">Check-in question<input value={segment.question || ""} onChange={event => onUpdateSegment(index, "question", event.target.value)} /></label>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="upload-actions">
              <button className="secondary" type="button" onClick={onAddSegment}>Add segment</button>
              <button className="primary" type="submit" disabled={uploadBusy || editedSegments.length === 0}>{uploadBusy ? "Saving…" : "Save lesson draft"}</button>
              <button className="secondary" type="button" onClick={() => onReviewLesson(editingLesson, false)}>Reset changes</button>
            </div>
          </form>
        </section>
      )}

      <section className="saved-materials">
        <div className="section-heading"><h2>Saved materials</h2><button className="text-link" type="button" onClick={() => onNavigate("course")}>Student course view</button></div>
        <div className="lesson-list">
          {lessons.map(lesson => (
            <article className="lesson-row" key={lesson.id}>
              <span className="lesson-art" aria-hidden="true">{lesson.kind === "pdf" || lesson.kind === "pptx" ? "▧" : "◉"}</span>
              <span><strong>{lesson.title}</strong><small>{lesson.course} · {lesson.kind.toUpperCase()} · {lesson.segments.length} segments</small></span>
              <span className="lesson-course-actions">
                <button className="secondary" type="button" onClick={() => onReviewLesson(lesson)}>Review</button>
                {lesson.id !== "demo-memory" && <button className="text-link danger-link" type="button" onClick={() => onDeleteLesson(lesson)}>Delete</button>}
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
