import { useParams } from 'react-router-dom'

export default function SegmentView() {
  const { id } = useParams()
  return <h1>Segment view (segment {id})</h1>
}