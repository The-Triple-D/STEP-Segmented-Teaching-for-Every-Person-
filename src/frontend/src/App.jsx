import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CourseList from './pages/CourseList.jsx'
import LessonList from './pages/LessonList.jsx'
import LessonPage from './pages/LessonPage.jsx'
import SegmentView from './pages/SegmentView.jsx'
import CheckIn from './pages/CheckIn.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:id" element={<LessonList />} />
        <Route path="/lessons/:id" element={<LessonPage />} />
        <Route path="/segments/:id" element={<SegmentView />} />
        <Route path="/checkin/:id" element={<CheckIn />} />
        <Route path="/flashcards/:id" element={<Flashcards />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}