import type { Artwork } from '../api/types'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getImageUrl } from '../api/image'
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

    // where the mascot sits on the progress line (0 = start, 1 = end)
    const progress = ids.length > 1 && index >= 0 ? index / (ids.length - 1) : 0
    const trackStart = 60
    const trackEnd = 940
    const markerX = trackStart + progress * (trackEnd - trackStart)

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

            <div
                className={styles.progress}
                role="progressbar"
                aria-label="Position in this list of artworks"
                aria-valuemin={1}
                aria-valuemax={ids.length}
                aria-valuenow={index + 1}
            >
                <svg className={styles.progressSvg} viewBox="0 26 1000 104" aria-hidden="true">
                    {/* faint pencil line for the whole length */}
                    <line className={styles.progressTrack} x1={trackStart} y1={110} x2={trackEnd} y2={110} />

                    {/* paint stroke, stretched from the start to the current position */}
                    <g transform={`translate(${trackStart} 110) scale(${Math.max(markerX - trackStart, 1) / 100} 1.7) translate(0 -110)`}>
                        <path
                            className={styles.progressFill}
                            d="M0 110 C2 103 8 102 15 103 C35 105 60 101 85 103 C92 104 97 102 100 104 L98 107 L100 110 L97 113 L100 116 C92 118 70 116 50 117 C30 118 10 119 3 116 C0 115 -1 112 0 110 Z"
                        />
                        <path className={styles.progressBristle} d="M4 107 C30 106 60 105 94 106" vectorEffect="non-scaling-stroke" />
                        <path className={styles.progressBristle} d="M6 113 C35 114 65 112 92 113" vectorEffect="non-scaling-stroke" />
                    </g>

                    <image
                        href={`${import.meta.env.BASE_URL}smiley.svg`}
                        x={markerX - 53}
                        y={35}
                        width={74}
                        height={64}
                    />
                </svg>
                <span className={styles.pagerStatus}>
                    {index + 1} of {ids.length}
                </span>
            </div>

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
