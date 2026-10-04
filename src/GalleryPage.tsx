import type { Artwork } from './types'

type Props = {
  artworks: Artwork[]
}

const GalleryPage = ({ artworks }: Props) => {
  return (
    <div>Gallery Page ({artworks.length} artworks)</div>
  )
}

export default GalleryPage
