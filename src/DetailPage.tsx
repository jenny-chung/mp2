import type { Artwork } from './types'

type Props = {
  artworks: Artwork[]
}

const DetailPage = ({ artworks }: Props) => {
  return (
    <div>Detail Page ({artworks.length} artworks)</div>
  )
}

export default DetailPage
