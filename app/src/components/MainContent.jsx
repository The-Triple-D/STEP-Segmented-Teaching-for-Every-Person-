import CheckinView from "./views/CheckinView.jsx";
import CourseView from "./views/CourseView.jsx";
import InsightsView from "./views/InsightsView.jsx";
import LessonView from "./views/LessonView.jsx";
import ProgressView from "./views/ProgressView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import StudyCardsView from "./views/StudyCardsView.jsx";
import TodayView from "./views/TodayView.jsx";
import UploadView from "./views/UploadView.jsx";

const screens = [
  ["today", TodayView],
  ["course", CourseView],
  ["lesson", LessonView],
  ["checkin", CheckinView],
  ["pdf", StudyCardsView],
  ["progress", ProgressView],
  ["settings", SettingsView],
  ["upload", UploadView],
  ["insights", InsightsView]
];

export default function MainContent(props) {
  const Screen = screens.find(([name]) => name === props.view)?.[1] || TodayView;
  return (
    <main className="content" id="main" tabIndex={-1}>
      <section
        className="view active"
        id={`view-${props.view}`}
        aria-labelledby={`${props.view}-title`}
      >
        <Screen {...props} />
      </section>
    </main>
  );
}
