import type { Artwork } from './types'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getImageUrl } from './image'
import styles from './DetailPage.module.css'

type Props = {
  artworks: Artwork[]
  backTo: string
}

const DetailPage = ({ artworks, backTo }: Props) => {
    const { id } = useParams() // reads :id from URL
    const location = useLocation() // reads state passed by a link
    const navigate = useNavigate()

    // find the artwork with id
    const artwork = artworks.find((a) => a.id === Number(id))

    if (!artwork) {
        return (
            <div className={styles.page}>
                <p className={styles.notFound}>Sorry, we couldn't find that artwork.</p>
                <Link className={styles.backLink} to="/list">Back to search</Link>
            </div>
        )
    }

    const ids: number[] = location.state?.ids ?? artworks.map((a) => a.id)

    const index = ids.indexOf(artwork.id)
    const prevId = index > 0 ? ids[index - 1] : undefined
    const nextId = index >= 0 && index < ids.length - 1 ? ids[index + 1] : undefined

    const backLabel = backTo.startsWith('/gallery') ? '← Back to gallery' : '← Back to search'

    function goTo(targetId: number) {
        navigate(`/artwork/${targetId}`, { state : { ids }, replace: true })
    }

  return (
    <div className={styles.page}>

        <Link className={styles.backLink} to={backTo}>{backLabel}</Link>

        {/* Prev and Next Navigation */}
        <div className={styles.pager}>
            <button
                className={styles.pagerButton}
                disabled={prevId === undefined}
                onClick={() => prevId !== undefined && goTo(prevId)}
            >
                ← Previous
            </button>

            <span className={styles.pagerStatus}>
                {index + 1} of {ids.length}
            </span>

            <button
                className={styles.pagerButton}
                disabled={nextId === undefined}
                onClick={() => nextId !== undefined && goTo(nextId)}
            >
                Next →
            </button>
        </div>

        {/* Artwork Details */}
        <div className={styles.layout}>
            <div className={styles.imageColumn}>
                <img
                    className={styles.image}
                    src={getImageUrl(artwork.imageId)}
                    alt={artwork.title}
                    referrerPolicy="no-referrer"
                />

                <dl className={styles.facts}>
                    <div className={styles.fact}>
                        <dt>Date</dt>
                        <dd>{artwork.dateDisplay}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt>Medium</dt>
                        <dd>{artwork.mediumDisplay}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt>Type</dt>
                        <dd>{artwork.artworkType}</dd>
                    </div>
                    <div className={styles.fact}>
                        <dt>Origin</dt>
                        <dd>{artwork.placeOfOrigin}</dd>
                    </div>
                    {artwork.dimensions && (
                        <div className={styles.fact}>
                            <dt>Dimensions</dt>
                            <dd>{artwork.dimensions}</dd>
                        </div>
                    )}
                </dl>
            </div>

            <div className={styles.info}>
                <h2 className={styles.title}>{artwork.title}</h2>
                <p className={styles.artist}>{artwork.artistTitle}</p>

                {artwork.description && <p className={styles.description}>{artwork.description}</p>}
            </div>
        </div>

    </div>
  )
}

export default DetailPage
