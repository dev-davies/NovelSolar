import { assertValidSlug, relativeFilePathForSlug } from '../../../utils/blogContent'
import {
  adminToCommitAuthor,
  commitMessageFor,
  deleteRemoteFile,
  getRemoteFile,
} from '../../../utils/blogGithub'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ slug?: string }>(event)
  const slug = (body?.slug || '').toLowerCase().trim()
  assertValidSlug(slug)

  const filePath = relativeFilePathForSlug(slug)
  const remote = await getRemoteFile(filePath)
  if (!remote) {
    throw createError({ statusCode: 404, statusMessage: `Blog post not found: ${slug}` })
  }

  const author = adminToCommitAuthor(event.context.admin)
  const result = await deleteRemoteFile({
    filePath,
    message: commitMessageFor('delete', slug),
    author,
    sha: remote.sha,
  })

  return {
    success: true,
    slug,
    commitSha: result.commitSha,
    message: 'Deleted from GitHub. The change will be live after the deployment triggered by this commit completes.',
  }
})
