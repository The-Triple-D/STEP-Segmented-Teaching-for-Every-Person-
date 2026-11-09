import { Link } from 'react-router-dom'
import { courses } from '../data/mockData.js'
import './CourseList.css'

function getStatus(progress) {
  if (progress >= 100) return 'Completed'
  if (progress <= 0) return 'Not started'
  return 'In progress'
}

export default function CourseList() {
  return (
    <div className="course-page">
      <h1 className="course-page__title">Course list</h1>
      <ul className="course-grid">
        {courses.map((course) => {
          const status = getStatus(course.progress)
          const done = course.progress >= 100
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
                  <span>{course.progress}%</span>
                </div>
                <div
                  className="progress"
                  role="progressbar"
                  aria-label={`${course.title} progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={course.progress}
                  aria-valuetext={`${status}, ${course.progress} percent`}
                >
                  <div
                    className={`progress__fill ${done ? 'progress__fill--done' : 'progress__fill--active'}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}