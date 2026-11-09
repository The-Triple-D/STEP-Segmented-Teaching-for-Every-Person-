import { useParams } from 'react-router-dom'

export default function CheckIn() {
  const { id } = useParams()
  return <h1>Check-in question (segment {id})</h1>
}