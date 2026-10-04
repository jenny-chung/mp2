import ListPage from './ListPage'
import GalleryPage from './GalleryPage'
import DetailPage from './DetailPage'
import { NavLink, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchArtworks } from './artworks'
import type { Artwork } from './types'
import styles from './App.module.css'

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
      <header className={styles.header}>
        <h1 className={styles.title}>the view</h1>

        {/* Navigation */}
        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
          >
            List
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
          >
            Gallery
          </NavLink>
        </nav>
      </header>

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
