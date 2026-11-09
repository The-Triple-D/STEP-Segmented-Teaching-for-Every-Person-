import { useParams } from 'react-router-dom'

export default function LessonList() {
  const { id } = useParams()
  return <h1>Lesson list (course {id})</h1>
}