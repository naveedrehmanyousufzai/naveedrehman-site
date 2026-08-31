import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// https://www.sanity.io/docs/image-urls
const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Build a Sanity CDN image URL from any Sanity image source (image object,
 * asset reference, or an existing `cdn.sanity.io` URL string). Chain the
 * builder to constrain the dimensions so the raw multi-megapixel originals
 * are never shipped to the browser, e.g.
 *   urlFor(src).width(1200).fit('max').auto('format').url()
 */
export const urlFor = (source: SanityImageSource) => builder.image(source)
