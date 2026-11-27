import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Home from './pages/Home.jsx'
import CourseList from './pages/CourseList.jsx'
import LessonList from './pages/LessonList.jsx'
import LessonPage from './pages/LessonPage.jsx'
import SegmentView from './pages/SegmentView.jsx'
import CheckIn from './pages/CheckIn.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import EditAccount from './pages/EditAccount.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<LessonList />} />
          <Route path="/lessons/:id" element={<LessonPage />} />
          <Route path="/segments/:id" element={<SegmentView />} />
          <Route path="/checkin/:id" element={<CheckIn />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<EditAccount />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}