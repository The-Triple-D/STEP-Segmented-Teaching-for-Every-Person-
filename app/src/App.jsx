import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MobileNavigation from "./components/MobileNavigation.jsx";
import MainContent from "./components/MainContent.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import "./styles.css";

const views = new Set(["today", "course", "lesson", "checkin", "pdf", "progress", "settings", "upload", "insights"]);
const defaultPreferences = {
  font: "standard",
  size: "normal",
  spacing: "normal",
  contrast: "soft",
  format: "watch",
  lowStimulation: false,
  sound: false,
  reduceMotion: false,
  reminders: false,
  reminderTime: "Not set"
};
const defaultOptions = ["I can explain one key idea", "I want to review one part", "I have a question to explore"];

async function api(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

function readPreferences() {
  try {
    return { ...defaultPreferences, ...JSON.parse(localStorage.getItem("littleStepsPrefs") || "{}") };
  } catch {
    return defaultPreferences;
  }
}

function getDuration(segment) {
  return Math.max(1, Number(segment?.minutes) || 5) * 60;
}

function formatTime(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function captionsToVtt(text) {
  const source = text.trim().replace(/\r\n/g, "\n");
  if (!source) return "";
  if (/^WEBVTT(?:\s|$)/i.test(source)) return source;
  const timedCues = source.replace(/^\s*\d+\s*$/gm, "").replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2").trim();
  if (/\d{2}:\d{2}:\d{2}[.,]\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}[.,]\d{3}/.test(timedCues)) {
    return `WEBVTT\n\n${timedCues}`;
  }
  return `WEBVTT\n\n00:00:00.000 --> 99:59:59.000\n${source.replace(/-->/g, "→")}\n`;
}

export default function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash.slice(1);
    return views.has(hash) ? hash : "today";
  });
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [lessonId, setLessonId] = useState("demo-memory");
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [checkinFeedback, setCheckinFeedback] = useState(null);
  const [format, setFormat] = useState("watch");
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [cardAnswerVisible, setCardAnswerVisible] = useState(false);
  const [preferences, setPreferences] = useState(readPreferences);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [captionFile, setCaptionFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCourse, setUploadCourse] = useState("Introduction to Psychology");
  const [transcriptDraft, setTranscriptDraft] = useState("");
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editedSegments, setEditedSegments] = useState([]);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [demoPosition, setDemoPosition] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [captionUrl, setCaptionUrl] = useState("");
  const videoRef = useRef(null);
  const progressQueue = useRef(Promise.resolve());
  const endedSegmentKey = useRef("");
  const finishSegmentRef = useRef(null);
  const toastTimer = useRef(0);

  const activeLesson = lessons.find(lesson => lesson.id === lessonId) || lessons[0] || null;
  const activeSegment = activeLesson?.segments[segmentIndex] || activeLesson?.segments[0] || null;
  const activeProgress = progress.find(item => item.lessonId === activeLesson?.id && item.segmentIndex === segmentIndex);
  const editingLesson = lessons.find(lesson => lesson.id === editingLessonId) || null;
  const documentLessons = lessons.filter(lesson => ["pdf", "pptx"].includes(lesson.kind));
  const completedSegments = progress.filter(item => item.completed).length;
  const totalSegments = lessons.reduce((count, lesson) => count + lesson.segments.length, 0);

  useEffect(() => {
    if (view === "pdf" && !["pdf", "pptx"].includes(activeLesson?.kind) && documentLessons[0]) {
      setLessonId(documentLessons[0].id);
      setSegmentIndex(0);
    }
  }, [activeLesson?.kind, documentLessons, view]);

  const notify = useCallback(message => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  const refreshState = useCallback(async () => {
    const data = await api("/api/state");
    setLessons(data.lessons);
    setProgress(data.progress);
    setLessonId(current => data.lessons.some(lesson => lesson.id === current) ? current : data.lessons[0]?.id || "");
    setLoading(false);
    setLoadError("");
    return data;
  }, []);

  useEffect(() => {
    refreshState().catch(error => {
      setLoading(false);
      setLoadError(error.message);
    });
  }, [refreshState]);

  useEffect(() => {
    document.title = "STEP | Segmented Teaching for Every Person";
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("font-dyslexia", preferences.font === "dyslexia");
    root.classList.toggle("large-text", preferences.size === "large");
    root.classList.toggle("spacing-wide", preferences.spacing === "wide");
    root.classList.toggle("contrast", preferences.contrast === "high");
    root.classList.toggle("reduce-motion", preferences.reduceMotion || preferences.lowStimulation);
    try {
      localStorage.setItem("littleStepsPrefs", JSON.stringify(preferences));
    } catch (error) {
      notify(`Preferences could not be saved: ${error.message}`);
    }
  }, [preferences, notify]);

  useEffect(() => {
    if (!activeLesson || activeLesson.kind !== "video" || !activeLesson.assetUrl) {
      setCaptionUrl("");
      return undefined;
    }
    const source = activeSegment?.captionsVtt || activeSegment?.transcript || activeLesson.transcript;
    if (!source) {
      setCaptionUrl("");
      return undefined;
    }
    const vtt = captionsToVtt(source);
    const url = URL.createObjectURL(new Blob([vtt], { type: "text/vtt" }));
    setCaptionUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [activeLesson, activeSegment]);

  useEffect(() => {
    if (!demoPlaying || activeLesson?.kind !== "demo") return undefined;
    const timer = window.setTimeout(() => {
      const next = Math.min(getDuration(activeSegment), demoPosition + 1);
      setDemoPosition(next);
      if (next >= getDuration(activeSegment)) finishSegmentRef.current?.(next);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [demoPlaying, activeLesson?.kind, activeSegment, demoPosition]);

  const saveProgress = useCallback(({ position, completed = false, answer = "" } = {}) => {
    if (!activeLesson) return Promise.resolve();
    const body = {
      lessonId: activeLesson.id,
      segmentIndex,
      position: Number(position ?? activeProgress?.position ?? 0),
      completed,
      answer
    };
    const write = progressQueue.current.then(async () => {
      await api("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      setProgress(items => {
        const existing = items.find(item => item.lessonId === body.lessonId && item.segmentIndex === body.segmentIndex);
        const updated = {
          lessonId: body.lessonId,
          segmentIndex: body.segmentIndex,
          position: body.position,
          completed: completed || Boolean(existing?.completed),
          answer: answer || existing?.answer || "",
          updatedAt: new Date().toISOString()
        };
        return [updated, ...items.filter(item => item !== existing)];
      });
    });
    progressQueue.current = write.catch(error => {
      console.error("Could not save lesson progress.", error);
    });
    return write;
  }, [activeLesson, activeProgress?.position, segmentIndex]);

  const saveVideoPosition = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 1 || !Number.isFinite(video.currentTime)) return;
    saveProgress({ position: video.currentTime }).catch(error => notify(`Progress could not be saved: ${error.message}`));
  }, [notify, saveProgress]);

  useEffect(() => {
    const syncViewFromLocation = () => {
      const nextView = window.location.hash.slice(1);
      if (!views.has(nextView)) return;
      if (view === "lesson" && nextView !== "lesson") {
        videoRef.current?.pause();
        saveVideoPosition();
        if (activeLesson?.kind === "demo") {
          saveProgress({ position: demoPosition }).catch(error => notify(`Progress could not be saved: ${error.message}`));
        }
      }
      setDemoPlaying(false);
      setView(nextView);
    };
    window.addEventListener("hashchange", syncViewFromLocation);
    window.addEventListener("popstate", syncViewFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncViewFromLocation);
      window.removeEventListener("popstate", syncViewFromLocation);
    };
  }, [activeLesson, demoPosition, notify, saveProgress, saveVideoPosition, view]);

  const sendPositionBeacon = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 1 || !Number.isFinite(video.currentTime) || !activeLesson) return;
    const body = JSON.stringify({
      lessonId: activeLesson.id,
      segmentIndex,
      position: video.currentTime,
      completed: false,
      answer: ""
    });
    const payload = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon("/api/progress", payload)) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true
      }).catch(error => console.error("Could not save lesson progress before leaving.", error));
    }
  }, [activeLesson, segmentIndex]);

  useEffect(() => {
    const saveWhenHidden = () => {
      if (document.visibilityState === "hidden") saveVideoPosition();
    };
    document.addEventListener("visibilitychange", saveWhenHidden);
    window.addEventListener("pagehide", sendPositionBeacon);
    return () => {
      document.removeEventListener("visibilitychange", saveWhenHidden);
      window.removeEventListener("pagehide", sendPositionBeacon);
    };
  }, [saveVideoPosition, sendPositionBeacon]);

  const navigate = useCallback(nextView => {
    if (!views.has(nextView)) return;
    if (view === "lesson" && nextView !== "lesson") {
      videoRef.current?.pause();
      saveVideoPosition();
      if (activeLesson?.kind === "demo") {
        saveProgress({ position: demoPosition }).catch(error => notify(`Progress could not be saved: ${error.message}`));
      }
    }
    setDemoPlaying(false);
    setView(nextView);
    window.history.replaceState(null, "", `#${nextView}`);
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => document.getElementById("main")?.focus({ preventScroll: true }));
  }, [activeLesson, demoPosition, notify, saveProgress, saveVideoPosition, view]);

  const navigateToView = useCallback(nextView => {
    if (nextView === "pdf" && !["pdf", "pptx"].includes(activeLesson?.kind)) {
      const firstDocument = lessons.find(lesson => lesson.kind === "pdf" || lesson.kind === "pptx");
      if (firstDocument) {
        setLessonId(firstDocument.id);
        setSegmentIndex(0);
      }
    }
    if (nextView === "lesson" && ["pdf", "pptx"].includes(activeLesson?.kind)) {
      const playable = lessons.find(lesson => lesson.kind === "video") || lessons.find(lesson => lesson.kind === "demo");
      if (playable) {
        const saved = progress.find(item => item.lessonId === playable.id && item.position > 0 && !item.completed);
        const firstIncomplete = playable.segments.findIndex((segment, index) =>
          !progress.some(item => item.lessonId === playable.id && item.segmentIndex === index && item.completed));
        const index = saved?.segmentIndex ?? Math.max(0, firstIncomplete);
        setLessonId(playable.id);
        setSegmentIndex(index);
        setDemoPosition(saved?.position || 0);
        setSelectedAnswer("");
        setCheckinFeedback(null);
      }
    }
    if (nextView === "lesson") setFormat(preferences.format);
    navigate(nextView);
  }, [activeLesson?.kind, lessons, navigate, preferences.format, progress]);

  const openLesson = useCallback((lesson, index = 0, targetView = "lesson") => {
    if (!lesson) return;
    videoRef.current?.pause();
    const savedPosition = progress.find(item => item.lessonId === lesson.id && item.segmentIndex === index)?.position || 0;
    setLessonId(lesson.id);
    setSegmentIndex(Math.max(0, Math.min(index, lesson.segments.length - 1)));
    setDemoPosition(savedPosition);
    setSelectedAnswer("");
    setCheckinFeedback(null);
    setCardAnswerVisible(false);
    setTranscriptSearch("");
    endedSegmentKey.current = "";
    setFormat(preferences.format);
    navigate(targetView);
  }, [navigate, preferences.format, progress]);

  const selectSegment = useCallback(index => {
    if (!activeLesson || index < 0 || index >= activeLesson.segments.length) return;
    saveVideoPosition();
    videoRef.current?.pause();
    const savedPosition = progress.find(item => item.lessonId === activeLesson.id && item.segmentIndex === index)?.position || 0;
    setSegmentIndex(index);
    setDemoPosition(savedPosition);
    setSelectedAnswer("");
    setCheckinFeedback(null);
    endedSegmentKey.current = "";
  }, [activeLesson, progress, saveVideoPosition]);

  const finishSegment = useCallback(position => {
    if (!activeLesson || !activeSegment) return;
    const key = `${activeLesson.id}:${segmentIndex}`;
    if (endedSegmentKey.current === key) return;
    endedSegmentKey.current = key;
    videoRef.current?.pause();
    setDemoPlaying(false);
    saveProgress({ position, completed: true }).catch(error => notify(`Progress could not be saved: ${error.message}`));
    navigate("checkin");
  }, [activeLesson, activeSegment, navigate, notify, saveProgress, segmentIndex]);

  useEffect(() => {
    finishSegmentRef.current = finishSegment;
  }, [finishSegment]);

  const handleVideoTimeUpdate = useCallback(event => {
    const video = event.currentTarget;
    const end = Number(activeSegment?.endSeconds);
    const start = Number(activeSegment?.startSeconds) || 0;
    if (activeSegment?.endSeconds != null && Number.isFinite(end) && end > start && video.currentTime >= end) {
      finishSegment(end);
      return;
    }
    const lastSaved = Number(video.dataset.lastSaved || 0);
    if (video.currentTime - lastSaved >= 4) {
      video.dataset.lastSaved = String(video.currentTime);
      saveProgress({ position: video.currentTime }).catch(error => notify(`Progress could not be saved: ${error.message}`));
    }
  }, [activeSegment, finishSegment, notify, saveProgress]);

  const handleVideoMetadata = useCallback(event => {
    const video = event.currentTarget;
    const resumeAt = Number(activeProgress?.position ?? activeSegment?.startSeconds ?? 0);
    if (Number.isFinite(resumeAt) && resumeAt > 0) video.currentTime = Math.min(resumeAt, video.duration || resumeAt);
  }, [activeProgress?.position, activeSegment?.startSeconds]);

  const submitCheckin = useCallback(async event => {
    event.preventDefault();
    if (!selectedAnswer || !activeSegment) return;
    const correct = selectedAnswer === activeSegment.answer;
    setCheckinFeedback({
      correct,
      message: correct ? activeSegment.explanation : `One way to think about it: ${activeSegment.explanation || "You can revisit this idea at any time."}`
    });
    try {
      await saveProgress({ position: activeProgress?.position ?? 0, completed: true, answer: selectedAnswer });
      notify("Check-in saved. Your progress is up to date.");
    } catch (error) {
      notify(`Progress could not be saved: ${error.message}`);
    }
  }, [activeProgress?.position, activeSegment, notify, saveProgress, selectedAnswer]);

  const continueFromCheckin = useCallback(async () => {
    if (!activeLesson) return;
    try {
      await saveProgress({ position: activeProgress?.position ?? 0, completed: true, answer: selectedAnswer });
    } catch (error) {
      notify(`Progress could not be saved: ${error.message}`);
      return;
    }
    if (segmentIndex < activeLesson.segments.length - 1) {
      selectSegment(segmentIndex + 1);
      navigate("lesson");
    } else {
      navigate("course");
    }
  }, [activeLesson, activeProgress?.position, navigate, notify, saveProgress, segmentIndex, selectSegment, selectedAnswer]);

  const updatePreference = useCallback((key, value) => {
    setPreferences(current => ({ ...current, [key]: value }));
  }, []);

  const reviewLesson = useCallback((lesson, upload = true) => {
    setEditingLessonId(lesson.id);
    setUploadTitle(lesson.title);
    setUploadCourse(lesson.course);
    setTranscriptDraft(lesson.transcript || "");
    setUploadFile(null);
    setCaptionFile(null);
    setEditedSegments(lesson.segments.map(segment => ({ ...segment })));
    setUploadStatus("");
    if (upload) navigate("upload");
  }, [navigate]);

  const handleFileSelection = useCallback(file => {
    setUploadFile(file);
    setCaptionFile(null);
    setTranscriptDraft("");
    setEditingLessonId(null);
    setEditedSegments([]);
    if (file && (!uploadTitle || uploadTitle === "How Memory Works")) {
      setUploadTitle(file.name.replace(/\.[^.]+$/, ""));
    }
    setUploadStatus(file ? `${file.name} selected. Submit it to create study cards or video segments.` : "No file selected.");
  }, [uploadTitle]);

  const submitUpload = useCallback(async event => {
    event.preventDefault();
    if (!uploadFile) return;
    setUploadBusy(true);
    setUploadStatus("Saving your material...");
    try {
      const body = new FormData();
      body.append("file", uploadFile);
      body.append("title", uploadTitle || uploadFile.name.replace(/\.[^.]+$/, ""));
      body.append("course", uploadCourse);
      body.append("transcript", transcriptDraft);
      if (captionFile) body.append("captions", captionFile);
      const lesson = await api("/api/uploads", { method: "POST", body });
      const state = await refreshState();
      setLessons(current => state.lessons.some(item => item.id === lesson.id)
        ? state.lessons.map(item => item.id === lesson.id ? lesson : item)
        : [lesson, ...state.lessons]);
      setUploadFile(null);
      setCaptionFile(null);
      reviewLesson(lesson, false);
      setUploadStatus(`${lesson.title} was added. Review its ${lesson.segments.length} suggested segment${lesson.segments.length === 1 ? "" : "s"} below.`);
      notify("Material saved. Review the suggested segments.");
    } catch (error) {
      setUploadStatus(error.message);
      notify(error.message);
    } finally {
      setUploadBusy(false);
    }
  }, [captionFile, notify, refreshState, reviewLesson, transcriptDraft, uploadCourse, uploadFile, uploadTitle]);

  const saveLessonDraft = useCallback(async event => {
    event.preventDefault();
    if (!editingLessonId || !editedSegments.length) return;
    setUploadBusy(true);
    try {
      const lesson = await api(`/api/lessons/${encodeURIComponent(editingLessonId)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: uploadTitle, course: uploadCourse, segments: editedSegments })
      });
      setLessons(current => current.map(item => item.id === lesson.id ? lesson : item));
      setEditedSegments(lesson.segments.map(segment => ({ ...segment })));
      setUploadStatus("Your lesson and segments are saved.");
      notify("Lesson draft saved on this device.");
    } catch (error) {
      setUploadStatus(error.message);
      notify(error.message);
    } finally {
      setUploadBusy(false);
    }
  }, [editedSegments, editingLessonId, notify, uploadCourse, uploadTitle]);

  const generateSuggestions = useCallback(async () => {
    if (!editingLesson) return;
    setUploadBusy(true);
    setUploadStatus("Preparing suggestions...");
    try {
      const isDocument = ["pdf", "pptx"].includes(editingLesson.kind);
      let transcript = transcriptDraft.trim();
      if (!isDocument && captionFile) transcript = await captionFile.text();
      if (!isDocument && !transcript) {
        throw new Error("Choose a .vtt/.srt caption file or paste transcript text first.");
      }
      const lesson = await api(`/api/lessons/${encodeURIComponent(editingLesson.id)}/suggestions`, {
        method: "POST",
        ...(isDocument ? {} : {
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ transcript })
        })
      });
      setLessons(current => current.map(item => item.id === lesson.id ? lesson : item));
      setEditedSegments(lesson.segments.map(segment => ({ ...segment })));
      setTranscriptDraft(lesson.transcript || transcriptDraft);
      setUploadStatus(`${lesson.segments.length} suggestions are ready to review.`);
      notify("Suggestions ready to review.");
    } catch (error) {
      setUploadStatus(error.message);
      notify(error.message);
    } finally {
      setUploadBusy(false);
    }
  }, [captionFile, editingLesson, notify, transcriptDraft]);

  const deleteLesson = useCallback(async lesson => {
    if (!window.confirm(`Delete "${lesson.title}" and its saved progress?`)) return;
    try {
      await api(`/api/lessons/${encodeURIComponent(lesson.id)}`, { method: "DELETE" });
      setLessons(current => current.filter(item => item.id !== lesson.id));
      setProgress(current => current.filter(item => item.lessonId !== lesson.id));
      if (lessonId === lesson.id) {
        const fallback = lessons.find(item => item.id !== lesson.id) || null;
        if (fallback) setLessonId(fallback.id);
      }
      if (editingLessonId === lesson.id) {
        setEditingLessonId(null);
        setEditedSegments([]);
      }
      notify("Material deleted.");
    } catch (error) {
      notify(`Material could not be deleted: ${error.message}`);
    }
  }, [editingLessonId, lessonId, lessons, notify]);

  const addSegment = useCallback(() => {
    setEditedSegments(items => [...items, {
      title: `Segment ${items.length + 1}`,
      minutes: 5,
      startSeconds: "",
      endSeconds: "",
      question: "What is one idea you want to remember?",
      options: defaultOptions,
      answer: defaultOptions[0],
      explanation: "A useful next step is to say the key idea in your own words."
    }]);
  }, []);

  const updateSegment = useCallback((index, key, value) => {
    setEditedSegments(items => items.map((segment, itemIndex) => itemIndex === index
      ? { ...segment, [key]: value }
      : segment));
  }, []);

  const nextCard = useCallback(async () => {
    if (!activeLesson || segmentIndex >= activeLesson.segments.length - 1) return;
    try {
      await saveProgress({ completed: true });
      selectSegment(segmentIndex + 1);
    } catch (error) {
      notify(`Progress could not be saved: ${error.message}`);
    }
  }, [activeLesson, notify, saveProgress, segmentIndex, selectSegment]);

  const startTextToSpeech = useCallback(speed => {
    if (!("speechSynthesis" in window)) {
      notify("Text-to-speech is not available in this browser.");
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(activeSegment?.transcript || activeSegment?.summary || "");
    utterance.rate = Number(speed) || 1;
    window.speechSynthesis.speak(utterance);
  }, [activeSegment, notify]);

  const transcript = activeSegment?.transcript || activeLesson?.transcript || "";
  const transcriptMatch = useMemo(() => {
    const term = transcriptSearch.trim();
    if (!term) return null;
    const index = transcript.toLocaleLowerCase().indexOf(term.toLocaleLowerCase());
    return index < 0 ? null : { start: index, end: index + term.length };
  }, [transcript, transcriptSearch]);

  if (loading) {
    return <main className="loading-screen" aria-live="polite">Loading your learning space…</main>;
  }
  if (loadError) {
    return <main className="loading-screen" role="alert">Your learning space could not load: {loadError}</main>;
  }

  const appProps = {
    view,
    lessons,
    documentLessons,
    progress,
    completedSegments,
    totalSegments,
    activeLesson,
    activeSegment,
    segmentIndex,
    activeProgress,
    selectedAnswer,
    checkinFeedback,
    format,
    transcriptSearch,
    transcript,
    transcriptMatch,
    videoRef,
    captionUrl,
    demoPosition,
    demoPlaying,
    preferences,
    uploadFile,
    captionFile,
    uploadTitle,
    uploadCourse,
    transcriptDraft,
    editingLesson,
    editedSegments,
    uploadBusy,
    uploadStatus,
    cardAnswerVisible,
    onNavigate: navigateToView,
    onOpenLesson: openLesson,
    onSelectSegment: selectSegment,
    onFinishSegment: finishSegment,
    onVideoTimeUpdate: handleVideoTimeUpdate,
    onVideoMetadata: handleVideoMetadata,
    onSaveVideoPosition: saveVideoPosition,
    onSaveProgress: saveProgress,
    onCheckinAnswer: setSelectedAnswer,
    onCheckinSubmit: submitCheckin,
    onContinueCheckin: continueFromCheckin,
    onFormatChange: setFormat,
    onTranscriptSearch: setTranscriptSearch,
    onDemoPosition: value => {
      const position = Number(value);
      setDemoPosition(position);
      saveProgress({ position }).catch(error => notify(`Progress could not be saved: ${error.message}`));
      if (activeLesson?.kind === "demo" && position >= getDuration(activeSegment)) finishSegment(position);
    },
    onDemoPlay: () => setDemoPlaying(value => !value),
    onPreferenceChange: updatePreference,
    onFileSelection: handleFileSelection,
    onCaptionSelection: setCaptionFile,
    onUploadTitleChange: setUploadTitle,
    onUploadCourseChange: setUploadCourse,
    onTranscriptChange: setTranscriptDraft,
    onUploadSubmit: submitUpload,
    onSaveDraft: saveLessonDraft,
    onGenerateSuggestions: generateSuggestions,
    onAddSegment: addSegment,
    onUpdateSegment: updateSegment,
    onReviewLesson: reviewLesson,
    onDeleteLesson: deleteLesson,
    onCardPrevious: () => selectSegment(Math.max(0, segmentIndex - 1)),
    onCardNext: nextCard,
    onCardAnswerToggle: () => setCardAnswerVisible(value => !value),
    onTextToSpeech: startTextToSpeech,
    onToast: notify
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="app">
        <Sidebar {...appProps} />
        <div className="main-shell">
          <Topbar {...appProps} />
          <MainContent {...appProps} />
        </div>
        <MobileNavigation {...appProps} />
        <div id="toast" className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">{toast}</div>
      </div>
    </>
  );
}
