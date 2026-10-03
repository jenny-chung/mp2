import ListPage from './ListPage'
import GalleryPage from './GalleryPage'
import DetailPage from './DetailPage'
import { Link, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchArtworks } from './artworks'

function App() {

  useEffect(() => {
    fetchArtworks().then((artworks) => console.log(artworks))
  }, [])

  return (
    <>
      <h1>gallivant</h1>

      {/* Navigation */}
      <nav>
        <Link to="/">List</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/artwork/:id" element={<DetailPage />} />
      </Routes>

    </>
  )
}

export default App
