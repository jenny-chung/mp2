import ListPage from './ListPage'
import GalleryPage from './GalleryPage'
import DetailPage from './DetailPage'
import { Link, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchArtworks } from './artworks'
import type { Artwork } from './types'

function App() {

  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArtworks()
      .then((data) => setArtworks(data))
      .catch((err) => setError(`Could not load artworks: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <>
      <h1>the view</h1>

      {/* Navigation */}
      <nav>
        <Link to="/">List</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ListPage artworks={artworks} />} />
        <Route path="/gallery" element={<GalleryPage artworks={artworks} />} />
        <Route path="/artwork/:id" element={<DetailPage artworks={artworks} />} />
      </Routes>

    </>
  )
}

export default App
