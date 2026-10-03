export type RawArtwork = {
    id: number
    title: string | null
    image_id: string | null
    artist_title: string | null
    date_start: number | null
    date_display: string | null
    artwork_type_title: string | null
    place_of_origin: string | null
    medium_display: string | null
    dimensions: string | null
    description: string | null
}

export type Artwork = {
    id: number,
    title: string,
    artistTitle: string,
    dateStart: number | null,
    dateDisplay: string,
    placeOfOrigin: string,
    mediumDisplay: string,
    dimensions: string,
    description: string,
    artworkType: string,
    imageId: string
}
