import { assertValidSlug, readLocalPost } from '../../../utils/blogContent'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  assertValidSlug(slug)

  const post = await readLocalPost(slug as string)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: `Blog post not found: ${slug}` })
  }

  return { success: true, post }
})
