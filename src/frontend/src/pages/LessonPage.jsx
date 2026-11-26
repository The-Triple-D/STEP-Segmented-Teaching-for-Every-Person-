import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './CourseList.css'

const API_BASE = 'http://localhost:8080'

export default function LessonPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [segments, setSegments] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [checkIns, setCheckIns] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 1. Load lesson + ordered ~250-word segments
  useEffect(() => {
    async function loadLesson() {
      setLoading(true)
      setError('')
      try {
        const [lessonRes, segRes] = await Promise.all([
          fetch(`${API_BASE}/lesson/api/getLesson/${id}`),
          fetch(`${API_BASE}/segment/api/getSegmentsByLesson/${id}`),
        ])

        if (!lessonRes.ok) throw new Error('Lesson not found.')

        const lessonData = await lessonRes.json()
        const segData = segRes.ok ? await segRes.json() : []

        setLesson(lessonData)
        setSegments(Array.isArray(segData) ? segData : [])
        setCurrentIndex(0)
      } catch (err) {
        setError(err.message || 'Could not load lesson.')
      } finally {
        setLoading(false)
      }
    }

    loadLesson()
  }, [id])

  const currentSegment = segments[currentIndex]

  // 2. Load check-in questions whenever the active segment changes
  useEffect(() => {
    if (!currentSegment) {
      setCheckIns([])
      return
    }

    setSelectedAnswer('')
    setChecked(false)

    async function loadCheckIns() {
      try {
        const res = await fetch(
          `${API_BASE}/checkin/api/getCheckInsBySegment/${currentSegment.id}`
        )
        if (!res.ok) {
          setCheckIns([])
          return
        }
        const data = await res.json()
        setCheckIns(Array.isArray(data) ? data : [])
      } catch {
        setCheckIns([])
      }
    }

    loadCheckIns()
  }, [currentSegment])

  if (loading) {
    return (
      <div className="learning-shell">
        <p>Loading micro-lesson...</p>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="learning-shell">
        <p role="alert" className="step-auth-alert">
          {error || 'Lesson not found.'}
        </p>
        <Link to="/courses" className="step-auth-link">
          ← Back to courses
        </Link>
      </div>
    )
  }

  const question = checkIns[0] || null
  const options = question
    ? [question.optionA, question.optionB, question.optionC, question.optionD].filter(Boolean)
    : []

  const isCorrect =
    checked &&
    question &&
    selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()

  return (
    <div className="learning-shell">
      <Link
        to={lesson.courseId ? `/courses/${lesson.courseId}` : '/courses'}
        className="step-auth-link"
      >
        ← Back to lessons
      </Link>

      <div className="learning-header">
        <h1>{lesson.title}</h1>
        {segments.length > 0 && (
          <p className="step-muted-note">
            Step {currentIndex + 1} of {segments.length}
            {currentSegment?.wordCount ? ` • ${currentSegment.wordCount} words` : ''}
            {currentSegment?.estimatedMinutes ? ` • ~${currentSegment.estimatedMinutes} min read` : ''}
          </p>
        )}
      </div>

      {segments.length === 0 ? (
        <div className="player-card">
          <p>This lesson has no segments yet. Chunk the lesson text first to view cards here.</p>
        </div>
      ) : (
        <>
          <article className="player-card">
            <p className="player-card__text">{currentSegment.text}</p>
          </article>

          {question && (
            <section className="checkin-card" aria-label="Check-in question">
              <h2>Quick Check-in</h2>
              <p className="checkin-card__question">{question.questionText}</p>

              <div className="checkin-options">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedAnswer(opt)
                      setChecked(false)
                    }}
                    className={`checkin-option ${
                      selectedAnswer === opt ? 'checkin-option--selected' : ''
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="step-btn-primary"
                disabled={!selectedAnswer}
                onClick={() => setChecked(true)}
                style={{ marginTop: '1rem' }}
              >
                CHECK ANSWER
              </button>

              {checked && (
                <div
                  role="status"
                  className={isCorrect ? 'step-auth-status' : 'step-auth-alert'}
                  style={{ marginTop: '1rem' }}
                >
                  <strong>{isCorrect ? 'Correct!' : 'Not quite.'}</strong>{' '}
                  {!isCorrect && `Correct answer: ${question.correctAnswer}. `}
                  {question.explanation && <span>{question.explanation}</span>}
                </div>
              )}
            </section>
          )}

          <div className="player-nav">
            <button
              type="button"
              className="step-btn-secondary"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              ← PREVIOUS
            </button>

            <button
              type="button"
              className="step-btn-primary"
              disabled={currentIndex === segments.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              NEXT →
            </button>
          </div>
        </>
      )}
    </div>
  )
}