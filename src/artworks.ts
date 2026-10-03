import { client } from './client'
import type { RawArtwork, Artwork } from './types'

const SEARCH_ENDPOINT = '/artworks/search'
const FIELDS =
  'id,title,image_id,artist_title,date_start,date_display,artwork_type_title,place_of_origin,medium_display,dimensions,description'

function stripHtml(html: string | null): string {
  if (!html) return ''
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
}

function normalize(raw: RawArtwork[]): Artwork[] {
  return raw
    .filter((artwork) => artwork.image_id)
    .map((artwork) => ({
      id: artwork.id,
      title: artwork.title ?? 'Untitled',
      artistTitle: artwork.artist_title ?? 'Unknown artist',
      dateStart: artwork.date_start,
      dateDisplay: artwork.date_display ?? 'Unknown date',
      placeOfOrigin: artwork.place_of_origin ?? 'Unknown origin',
      mediumDisplay: artwork.medium_display ?? 'Unknown medium',
      dimensions: artwork.dimensions ?? '',
      description: stripHtml(artwork.description), 
      artworkType: artwork.artwork_type_title ?? 'Unknown type',
      imageId: artwork.image_id as string,
    }))
}

export async function fetchArtworks(): Promise<Artwork[]> {
  const response = await client.get(SEARCH_ENDPOINT, {
    params: {
      q: 'monet',
      limit: 100,
      fields: FIELDS,
     }
  });

  return normalize(response.data.data as RawArtwork[])
  
}

