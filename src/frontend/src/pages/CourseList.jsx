import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { courses as mockCourses } from '../data/mockData.js'
import './CourseList.css'

const API_BASE = 'http://localhost:8080'

function getStatus(progress) {
  if (progress >= 100) return 'Completed'
  if (progress <= 0) return 'Not started'
  return 'In progress'
}

export default function CourseList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)

  const query = searchParams.get('q') || ''
  const statusFilter = searchParams.get('status') || 'all'

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch(`${API_BASE}/course/api/getAllCourses`)
        if (!res.ok) throw new Error('Failed to load courses')
        const data = await res.json()

        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((c) => ({
            ...c,
            progress: typeof c.progress === 'number' ? c.progress : 0,
          }))
          setCourses(formatted)
          setUsingMock(false)
        } else {
          setCourses(mockCourses)
          setUsingMock(true)
        }
      } catch {
        setCourses(mockCourses)
        setUsingMock(true)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next)
  }

  const filteredCourses = courses.filter((course) => {
    const text = `${course.title || ''} ${course.description || ''}`.toLowerCase()
    const matchesQuery = text.includes(query.trim().toLowerCase())

    const progress = course.progress ?? 0
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && progress >= 100) ||
      (statusFilter === 'in-progress' && progress > 0 && progress < 100) ||
      (statusFilter === 'not-started' && progress <= 0)

    return matchesQuery && matchesStatus
  })

  return (
    <div className="course-page">
      <div>
        <h1 className="course-page__title">Course list</h1>

        <div className="course-filters">
          <label className="step-field">
            <span>Search courses</span>
            <input
              type="search"
              value={query}
              onChange={(e) => updateFilter('q', e.target.value)}
              placeholder="Search by code or title..."
            />
          </label>

          <label className="step-field">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="all">All courses</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not started</option>
            </select>
          </label>
        </div>

        {usingMock && (
          <p className="step-muted-note">
            Showing sample courses (no courses found in MySQL yet).
          </p>
        )}
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : filteredCourses.length === 0 ? (
        <p>No courses match your filter.</p>
      ) : (
        <ul className="course-grid">
          {filteredCourses.map((course) => {
            const progress = course.progress ?? 0
            const status = getStatus(progress)
            const done = progress >= 100
            return (
              <li key={course.id}>
                <Link to={`/courses/${course.id}`} className="course-card">
                  {done && (
                    <span className="course-card__star" aria-hidden="true">★</span>
                  )}
                  <h2 className="course-card__code">{course.title}</h2>
                  <p className="course-card__desc">{course.description}</p>
                  <div className="course-card__meta">
                    <span>{status}</span>
                    <span>{progress}%</span>
                  </div>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={`${course.title} progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    aria-valuetext={`${status}, ${progress} percent`}
                  >
                    <div
                      className={`progress__fill ${done ? 'progress__fill--done' : 'progress__fill--active'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}