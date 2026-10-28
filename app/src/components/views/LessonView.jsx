import { useState } from "react";

function renderTranscript(text, match) {
  if (!match) return text || "No transcript is available for this segment yet.";
  return <>
    {text.slice(0, match.start)}
    <mark>{text.slice(match.start, match.end)}</mark>
    {text.slice(match.end)}
  </>;
}

export default function LessonView(props) {
  const [speechRate, setSpeechRate] = useState("1");
  const {
    activeLesson, activeSegment, segmentIndex, progress, format, transcript, transcriptMatch,
    transcriptSearch, captionUrl, videoRef, demoPosition, demoPlaying, onNavigate, onSelectSegment,
    onVideoTimeUpdate, onVideoMetadata, onSaveVideoPosition, onFinishSegment, onDemoPosition, onDemoPlay,
    onFormatChange, onTranscriptSearch, onTextToSpeech
  } = props;
  if (!activeLesson || !activeSegment) return <p className="empty-state">Choose a lesson to get started.</p>;
  const isDocument = activeLesson.kind === "pdf" || activeLesson.kind === "pptx";
  const duration = Math.max(1, Number(activeSegment.minutes) || 5) * 60;
  const progressFor = index => progress.find(item => item.lessonId === activeLesson.id && item.segmentIndex === index);
  const formats = [
    ["watch", "Watch"],
    ["listen", "Listen"],
    ["read", "Read"],
    ["visual", "Visual summary"]
  ];

  if (isDocument) {
    return (
      <>
        <div className="page-head"><div><p className="eyebrow">Reading, in smaller pieces</p><h1>{activeLesson.title}</h1><p className="lede">{activeLesson.course} · one source segment at a time.</p></div><span className="status">Study material</span></div>
        <button className="secondary" type="button" onClick={() => onNavigate("pdf")}>Open study cards <span aria-hidden="true">→</span></button>
      </>
    );
  }

  const transcriptText = transcript || activeSegment.summary || "";
  const chooseFormat = value => {
    onFormatChange(value);
  };

  return (
    <>
      <div className="lesson-topline">
        <span><button className="inline-link" type="button" onClick={() => onNavigate("course")}>{activeLesson.course}</button> / {activeLesson.title}</span>
        <span>Segment <strong>{segmentIndex + 1}</strong> of {activeLesson.segments.length}</span>
      </div>
      <div className="lesson-layout">
        <div className="player-main">
          <p className="eyebrow">{activeSegment.minutes || 5} minute lesson</p>
          <h1 id="lesson-title">{activeSegment.title}</h1>
          <div className="media-frame" role="group" aria-label={`${activeLesson.kind === "video" ? "Video" : "Sample"} lesson: ${activeLesson.title}, ${activeSegment.title}`}>
            {activeLesson.kind === "video" && activeLesson.assetUrl ? (
              <video
                key={`${activeLesson.id}-${segmentIndex}`}
                ref={videoRef}
                className="active-video"
                src={activeLesson.assetUrl}
                controls
                preload="metadata"
                playsInline
                aria-label={`Video lesson: ${activeLesson.title}, ${activeSegment.title}`}
                onLoadedMetadata={onVideoMetadata}
                onPause={onSaveVideoPosition}
                onSeeked={onSaveVideoPosition}
                onTimeUpdate={onVideoTimeUpdate}
                onEnded={event => onFinishSegment(event.currentTarget.duration || event.currentTarget.currentTime)}
              >
                {captionUrl && <track kind="captions" src={captionUrl} srcLang="en" label="English" default />}
              </video>
            ) : (
              <>
                <div className="media-illustration" aria-hidden="true" />
                <button className="play-button" type="button" aria-label={demoPlaying ? "Pause sample lesson" : "Play sample lesson"} onClick={onDemoPlay}>{demoPlaying ? "Ⅱ" : "▶"}</button>
                <div className="media-controls">
                  <span>{formatTime(demoPosition)}</span>
                  <input aria-label="Video position" type="range" min="0" max={duration} value={Math.min(demoPosition, duration)} onChange={event => onDemoPosition(event.target.value)} />
                  <span>{formatTime(duration)}</span>
                </div>
                <p className="media-caption">{activeSegment.summary}</p>
              </>
            )}
          </div>
          <div className="format-tabs" role="tablist" aria-label="Lesson format">
            {formats.map(([id, label]) => (
              <button className="format-tab" type="button" role="tab" aria-selected={format === id} key={id} onClick={() => chooseFormat(id)}>{label}</button>
            ))}
          </div>
          {format === "watch" && <div className="format-content" role="tabpanel"><p className="read-copy">{activeSegment.summary || transcriptText || "A short introduction to this idea."}</p></div>}
          {format === "listen" && (
            <div className="format-content" role="tabpanel">
              <div className="listen-box">
                <button className="primary" type="button" onClick={() => onTextToSpeech(speechRate)}>▶ <span>Play audio</span></button>
                <label htmlFor="speed-select">Speed</label>
                <select id="speed-select" value={speechRate} onChange={event => setSpeechRate(event.target.value)}>
                  <option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option>
                </select>
                <p>Audio version · about {activeSegment.minutes || 1} minute</p>
              </div>
            </div>
          )}
          {format === "read" && <div className="format-content" role="tabpanel"><div className="read-copy"><h2>{activeSegment.title}</h2><p>{transcriptText || "No transcript is available yet."}</p></div></div>}
          {format === "visual" && (
            <div className="format-content" role="tabpanel">
              <div className="listen-box visual-map"><strong>{activeLesson.course}</strong><span aria-hidden="true">→</span><strong>{activeSegment.title}</strong></div>
              <p className="read-copy">{activeSegment.summary || transcriptText}</p>
            </div>
          )}
          <section className="transcript" aria-labelledby="transcript-title">
            <div className="transcript-head"><h3 id="transcript-title">Searchable transcript</h3><span className="status done">{transcript ? "Available" : "Not available"}</span></div>
            <label htmlFor="transcript-search">Search transcript</label>
            <input id="transcript-search" type="search" value={transcriptSearch} onChange={event => onTranscriptSearch(event.target.value)} />
            <p id="transcript-text" aria-live="polite">{transcriptSearch && !transcriptMatch ? "No matches in this segment." : renderTranscript(transcriptText, transcriptMatch)}</p>
          </section>
          <button className="primary" type="button" onClick={() => onNavigate("checkin")}>Go to check-in <span aria-hidden="true">→</span></button>
        </div>
        <aside className="player-side">
          <h3>{activeLesson.title}</h3>
          <p>Your place is saved automatically.</p>
          <div className="segment-list">
            {activeLesson.segments.map((segment, index) => {
              const saved = progressFor(index);
              return (
                <button className={`segment${index === segmentIndex ? " selected" : ""}`} type="button" key={`${activeLesson.id}-${index}`} onClick={() => onSelectSegment(index)}>
                  <span className="segment-number">{index + 1}</span>
                  <span><strong>{segment.title}</strong><small>{segment.minutes || 5} min · {saved?.completed ? "Done" : saved?.position ? "In progress" : "Not started"}</small></span>
                </button>
              );
            })}
          </div>
          <button className="secondary" type="button" onClick={() => onNavigate("checkin")}>Check in on this lesson</button>
        </aside>
      </div>
    </>
  );
}

function formatTime(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
