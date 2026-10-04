import type { Artwork } from "./types";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import styles from "./GalleryPage.module.css";
import { getImageUrl } from "./image";

type Props = {
  artworks: Artwork[];
};

const GalleryPage = ({ artworks }: Props) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const types = useMemo(
    () => [...new Set(artworks.map((artwork) => artwork.artworkType))].sort(),
    [artworks]
  );

  const filteredArtworks = useMemo(
    () =>
      selectedTypes.length === 0
        ? artworks
        : artworks.filter((artwork) => selectedTypes.includes(artwork.artworkType)),
    [artworks, selectedTypes]
  );

  const orderedIds = useMemo(
    () => filteredArtworks.map((artwork) => artwork.id),
    [filteredArtworks]
  );

  function toggleType(type: string) {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.filters} role="group" aria-label="Filter by artwork type">
        <span className={styles.filtersLabel}>Filter by type</span>
        {types.map((type) => (
          <button
            key={type}
            className={styles.filterButton}
            aria-pressed={selectedTypes.includes(type)}
            onClick={() => toggleType(type)}
          >
            {type}
          </button>
        ))}

        {selectedTypes.length > 0 && (
          <button className={styles.clearButton} onClick={() => setSelectedTypes([])}>
            Clear
          </button>
        )}
      </div>

      <ul className={styles.grid}>
        {filteredArtworks.map((artwork) => (
          <li key={artwork.id}>
            <Link
              className={styles.tile}
              to={`/artwork/${artwork.id}`}
              state={{ ids: orderedIds }}
            >
              <img
                className={styles.image}
                src={getImageUrl(artwork.imageId, 400)}
                alt={artwork.title}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <span className={styles.caption}>{artwork.title}</span>
              <span className={styles.type}>{artwork.artworkType}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GalleryPage;
