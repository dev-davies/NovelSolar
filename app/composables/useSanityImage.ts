import imageUrlBuilder from '@sanity/image-url'

/**
 * Composable to handle Sanity Image URL generation with optimizations.
 * Uses the @sanity/image-url package and existing Sanity config.
 */
export const useSanityImage = () => {
  const sanity = useSanity()
  
  // Use the underlying client from @nuxtjs/sanity
  const builder = imageUrlBuilder(sanity.client)

  /**
   * Generates a builder for a specific Sanity image source.
   * Usage: urlFor(post.mainImage).width(800).url()
   */
  const urlFor = (source: any) => {
    return builder.image(source).auto('format').fit('max')
  }

  return {
    urlFor
  }
}
