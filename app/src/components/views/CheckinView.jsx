export default function CheckinView({
  activeLesson, activeSegment, segmentIndex, selectedAnswer, checkinFeedback,
  onCheckinAnswer, onCheckinSubmit, onContinueCheckin
}) {
  if (!activeLesson || !activeSegment) return <p className="empty-state">Choose a lesson before checking in.</p>;
  const options = activeSegment.options?.length
    ? activeSegment.options
    : ["I can explain one key idea", "I want to review one part", "I have a question to explore"];

  return (
    <section className="checkin-card">
      <p className="eyebrow">A moment to reflect</p>
      <h1 id="checkin-title">A quick check-in</h1>
      <p className="question-meta"><span>{activeLesson.title} · {activeSegment.title}</span><span>Segment {segmentIndex + 1} of {activeLesson.segments.length}</span></p>
      <form onSubmit={onCheckinSubmit}>
        <fieldset className="checkin-fieldset">
          <legend className="question">{activeSegment.question || "What is one idea you want to remember from this section?"}</legend>
          <div className="options">
            {options.map((option, index) => (
              <label className="option" key={`${index}-${option}`}>
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  disabled={Boolean(checkinFeedback)}
                  onChange={() => onCheckinAnswer(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {checkinFeedback && (
          <div className="feedback show" role="status" aria-live="polite">
            <h2>{checkinFeedback.correct ? "That's it." : "Good thinking. Keep exploring."}</h2>
            <p>{checkinFeedback.message}</p>
          </div>
        )}
        {!checkinFeedback
          ? <button className="primary" type="submit" disabled={!selectedAnswer}>Check answer</button>
          : <button className="primary" type="button" onClick={onContinueCheckin}>Continue <span aria-hidden="true">→</span></button>}
      </form>
    </section>
  );
}
