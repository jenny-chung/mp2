import ListPage from './ListPage'
import GalleryPage from './GalleryPage'
import DetailPage from './DetailPage'
import { NavLink, Link, Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchArtworks } from './artworks'
import type { Artwork } from './types'
import styles from './App.module.css'
import { ListIcon, GalleryIcon } from './icons'

function App() {

  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const location = useLocation()
  const [lastList, setLastList] = useState('/list')
  const [lastGallery, setLastGallery] = useState('/gallery')
  const [lastSection, setLastSection] = useState<'list' | 'gallery'>('list')

  useEffect(() => {
    fetchArtworks()
      .then((data) => setArtworks(data))
      .catch((err) => setError(`Could not load artworks: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  // Remember the last URL (with its search/sort/filter query) of the list and gallery pages
  useEffect(() => {
    const url = location.pathname + location.search
    if (location.pathname === '/list') {
      setLastList(url)
      setLastSection('list')
    } else if (location.pathname === '/gallery') {
      setLastGallery(url)
      setLastSection('gallery')
    }
  }, [location.pathname, location.search])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <>
      <header className={styles.header}>
        <Link to="/list" className={styles.brand}>
          <img
            className={styles.logo}
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt=""
          />
          <h1 className={styles.title}>the view</h1>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <NavLink
            to={lastList}
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
          >
            <ListIcon className={styles.navIcon} />
            List
          </NavLink>
          <NavLink
            to={lastGallery}
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
          >
            <GalleryIcon className={styles.navIcon} />
            Gallery
          </NavLink>
        </nav>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to={lastSection === 'gallery' ? lastGallery : lastList} replace />} />
        <Route path="/list" element={<ListPage artworks={artworks} />} />
        <Route path="/gallery" element={<GalleryPage artworks={artworks} />} />
        <Route path="/artwork/:id" element={<DetailPage artworks={artworks} />} />
      </Routes>

    </>
  )
}

export default App
