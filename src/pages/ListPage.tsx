import type { Artwork } from "../api/types";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import styles from "./ListPage.module.css";
import { getImageUrl } from "../api/image";
import { updateSearchParams } from "../utils/searchParams";

type Props = {
  artworks: Artwork[];
};

type SortField = 'title' | 'artist' | 'date'
type SortOrder = 'asc' | 'desc'

const SORT_FIELDS: SortField[] = ['title', 'artist', 'date']
const SORT_ORDERS: SortOrder[] = ['asc', 'desc']

const ListPage = ({ artworks }: Props) => {

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') ?? ''
  const sortByParam = searchParams.get('sort')
  const sortOrderParam = searchParams.get('order')
  const sortBy = SORT_FIELDS.find((field) => field === sortByParam) ?? 'title'
  const sortOrder = SORT_ORDERS.find((order) => order === sortOrderParam) ?? 'asc'

  function updateParams(updates: Record<string, string>) {
    updateSearchParams(setSearchParams, (next) => {
      for (const [key, value] of Object.entries(updates)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
    })
  }

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
            <div className={styles.searchWrap}>
                <input
                    className={styles.search}
                    value={search}
                    onChange={(e) => updateParams({ q: e.target.value })}
                    placeholder="Search artwork by title or artist"
                />
                {search && (
                    <button
                        type="button"
                        className={styles.clearSearch}
                        onClick={() => updateParams({ q: '' })}
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>

            <label className={styles.sortLabel}>
                Sort by: 
                <select
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={(e) => updateParams({ sort: e.target.value })}
                >
                    <option value="title">Title</option>
                    <option value="artist">Artist</option>
                    <option value="date">Date</option>
                </select>
            </label>

            <button
                className={styles.orderButton}
                onClick={() => updateParams({ order: sortOrder === "asc" ? "desc" : "asc" })}
            >
                {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
            </button>
        </div>

        {search && sortedArtworks.length > 0 && (
            <p className={styles.resultCount} role="status">
                {sortedArtworks.length} {sortedArtworks.length === 1 ? 'artwork' : 'artworks'} found
            </p>
        )}

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
