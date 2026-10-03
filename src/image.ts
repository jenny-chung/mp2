const IMAGE_BASE_URL = 'https://www.artic.edu/iiif/2'

export function getImageUrl(imageId: string, width = 843): string {
  return `${IMAGE_BASE_URL}/${imageId}/full/${width},/0/default.jpg`
}