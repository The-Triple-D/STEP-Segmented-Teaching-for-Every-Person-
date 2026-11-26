import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './CourseList.css'

const API_BASE = 'http://localhost:8080'

export default function LessonList() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCourseDetails() {
      setLoading(true)
      setError('')
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`${API_BASE}/course/api/getCourse/${id}`),
          fetch(`${API_BASE}/lesson/api/getLessonsByCourse/${id}`),
        ])

        if (!courseRes.ok) {
          throw new Error('Course not found in the database.')
        }

        const courseData = await courseRes.json()
        const lessonsData = lessonsRes.ok ? await lessonsRes.json() : []

        setCourse(courseData)
        setLessons(Array.isArray(lessonsData) ? lessonsData : [])
      } catch (err) {
        setError(err.message || 'Could not load course details.')
      } finally {
        setLoading(false)
      }
    }

    loadCourseDetails()
  }, [id])

  if (loading) {
    return (
      <div className="learning-shell">
        <p>Loading course...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="learning-shell">
        <p role="alert" className="step-auth-alert">
          {error || 'Course not found.'}
        </p>
        <Link to="/courses" className="step-auth-link">
          ← Back to courses
        </Link>
      </div>
    )
  }

  return (
    <div className="learning-shell">
      <Link to="/courses" className="step-auth-link">
        ← Back to courses
      </Link>

      <div className="learning-header">
        <h1>{course.title}</h1>
        {course.description && <p className="step-muted-note">{course.description}</p>}
      </div>

      <h2>Lessons</h2>

      {lessons.length === 0 ? (
        <p>No lessons have been added to this course yet.</p>
      ) : (
        <ul className="lesson-list">
          {lessons.map((lesson, index) => (
            <li key={lesson.id} className="lesson-item">
              <div>
                <span className="step-role-pill">Lesson {index + 1}</span>
                <h3>{lesson.title}</h3>
                <p className="step-muted-note">
                  {lesson.sourceType || 'TEXT'}
                  {lesson.estimatedDuration ? ` • ~${lesson.estimatedDuration} min` : ''}
                  {lesson.status ? ` • ${lesson.status}` : ''}
                </p>
              </div>
              <Link to={`/lessons/${lesson.id}`} className="step-btn-primary lesson-item__btn">
                START LESSON
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}