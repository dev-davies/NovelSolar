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

  // Trigger Vercel build immediately
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (deployHookUrl) {
    // Fire and forget - don't await so we don't block the UI
    $fetch(deployHookUrl, { method: 'POST' }).catch(err => {
      console.error('Failed to trigger Vercel deploy hook:', err)
    })
  }

  return {
    success: true,
    slug,
    commitSha: result.commitSha,
    message: 'Deleted from GitHub. The change will be live after the deployment triggered by this commit completes.',
  }
})
