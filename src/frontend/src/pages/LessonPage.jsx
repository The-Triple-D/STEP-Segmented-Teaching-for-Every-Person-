import { useParams } from 'react-router-dom'

export default function LessonPage() {
  const { id } = useParams()
  return <h1>Lesson page (lesson {id})</h1>
}