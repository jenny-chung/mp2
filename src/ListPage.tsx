import type { Artwork } from './types'

type Props = {
  artworks: Artwork[]
}

const ListPage = ({ artworks }: Props) => {
  return (
    <div>List Page ({artworks.length} artworks)</div>
  )
}

export default ListPage
