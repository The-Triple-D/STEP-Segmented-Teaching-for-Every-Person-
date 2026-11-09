import { useParams } from 'react-router-dom'

export default function Flashcards() {
  const { id } = useParams()
  return <h1>Flashcards (segment {id})</h1>
}