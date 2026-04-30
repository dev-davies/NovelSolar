import {
  assertValidSlug,
  isValidSlug,
  readLocalPost,
  relativeFilePathForSlug,
  serializePost,
  type BlogFrontmatter,
} from '../../../utils/blogContent'
import {
  adminToCommitAuthor,
  commitMessageFor,
  getRemoteFile,
  putRemoteFile,
} from '../../../utils/blogGithub'

interface SaveBody {
  slug: string
  originalSlug?: string
  title: string
  description?: string
  excerpt?: string
  date?: string
  image?: string
  category?: string
  author?: string
  draft?: boolean
  body?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<SaveBody>(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Request body is required.' })
  }

  const slug = (body.slug || '').toLowerCase().trim()
  assertValidSlug(slug)

  const originalSlug = body.originalSlug ? body.originalSlug.toLowerCase().trim() : ''
  const isRename = originalSlug && originalSlug !== slug
  if (originalSlug && !isValidSlug(originalSlug)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid originalSlug.' })
  }

  if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Post title is required.' })
  }

  if (!isRename || (originalSlug && originalSlug !== slug)) {
    const collision = await readLocalPost(slug).catch(() => null)
    if (collision && (!originalSlug || originalSlug !== slug)) {
      const isUpdatingExisting = !originalSlug
      if (!isUpdatingExisting) {
        throw createError({ statusCode: 409, statusMessage: `Slug already exists: ${slug}` })
      }
    }
  }

  const frontmatter: BlogFrontmatter = {
    title: body.title.trim(),
    description: body.description?.trim() || undefined,
    excerpt: body.excerpt?.trim() || undefined,
    date: body.date || new Date().toISOString().slice(0, 10),
    image: body.image?.trim() || undefined,
    category: body.category?.trim() || undefined,
    author: body.author?.trim() || undefined,
    draft: body.draft === true,
  }

  const fileContent = serializePost({ frontmatter, body: body.body || '' })
  const filePath = relativeFilePathForSlug(slug)
  const author = adminToCommitAuthor(event.context.admin)

  const existing = await getRemoteFile(filePath)
  const isNew = !existing
  const action: 'publish' | 'update' = isNew ? 'publish' : 'update'

  const writeResult = await putRemoteFile({
    filePath,
    content: fileContent,
    message: commitMessageFor(action, slug),
    author,
    sha: existing?.sha,
  })

  let renameCommitSha: string | undefined
  if (isRename) {
    const oldPath = relativeFilePathForSlug(originalSlug)
    const oldRemote = await getRemoteFile(oldPath)
    if (oldRemote) {
      const { deleteRemoteFile } = await import('../../../utils/blogGithub')
      const del = await deleteRemoteFile({
        filePath: oldPath,
        message: commitMessageFor('delete', originalSlug),
        author,
        sha: oldRemote.sha,
      })
      renameCommitSha = del.commitSha
    }
  }

  return {
    success: true,
    slug,
    action,
    commitSha: writeResult.commitSha,
    renameCommitSha,
    message: `Committed to GitHub. The change will be live after the deployment triggered by this commit completes.`,
  }
})
