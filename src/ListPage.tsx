import type { Artwork } from "./types";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import styles from "./ListPage.module.css";
import { getImageUrl } from "./image";

type Props = {
  artworks: Artwork[];
};

type SortField = 'title' | 'artist' | 'date'

const ListPage = ({ artworks }: Props) => {

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const query = search.toLowerCase()

  const sortedArtworks = useMemo(() => {
    const filtered = artworks.filter((artwork) => (
      artwork.title.toLowerCase().includes(query) ||
      artwork.artistTitle.toLowerCase().includes(query)
    ))

    const sortedAsc = filtered.toSorted((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title)
      if (sortBy === "artist") return a.artistTitle.localeCompare(b.artistTitle)

      if (a.dateStart === null) return 1
      if (b.dateStart === null) return -1
      return a.dateStart - b.dateStart
    })

    // flip results for descending order
    return sortOrder === "asc" ? sortedAsc : sortedAsc.toReversed()
  }, [artworks, query, sortBy, sortOrder])

  const orderedIds = useMemo(() => sortedArtworks.map((artwork) => artwork.id), [sortedArtworks])

  return (
    <div className={styles.page}>
        <div className={styles.controls}>
            <input
                className={styles.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artwork by title or artist"
            />

            <label className={styles.sortLabel}>
                Sort by
                <select
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortField)}
                >
                    <option value="title">Title</option>
                    <option value="artist">Artist</option>
                    <option value="date">Date</option>
                </select>
            </label>

            <button
                className={styles.orderButton}
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
                {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
            </button>
        </div>

        {sortedArtworks.length === 0 ? (
            <p className={styles.empty}>No artworks match your search.</p>
        ) : (
            <ul className={styles.list}>
                {sortedArtworks.map((artwork) => (
                <li key={artwork.id}>
                    <Link
                        className={styles.row}
                        to={`/artwork/${artwork.id}`}
                        state={{ ids: orderedIds }}
                    >
                        <img
                            className={styles.thumb}
                            src={getImageUrl(artwork.imageId, 200)}
                            alt={artwork.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                        <div className={styles.text}>
                            <span className={styles.title}>{artwork.title}</span>
                            <span className={styles.meta}>{artwork.artistTitle} · {artwork.dateDisplay}</span>
                        </div>
                    </Link>
                </li>
                ))}
            </ul>
        )}
    </div>
  );
};

export default ListPage;
