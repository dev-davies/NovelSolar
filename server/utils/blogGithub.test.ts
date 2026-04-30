import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

vi.stubGlobal('createError', (opts: { statusCode: number, statusMessage: string }) => {
  const err = new Error(opts.statusMessage) as any
  err.statusCode = opts.statusCode
  return err
})

import {
  adminToCommitAuthor,
  commitMessageFor,
  deleteRemoteFile,
  getRemoteFile,
  putRemoteFile,
} from './blogGithub'

beforeEach(() => {
  mockFetch.mockReset()
  process.env.BLOG_GITHUB_TOKEN = 'ghp_test_token'
  process.env.BLOG_GITHUB_OWNER = 'dev-davies'
  process.env.BLOG_GITHUB_REPO = 'NovelSolar'
  process.env.BLOG_GITHUB_BRANCH = 'master'
})

describe('commitMessageFor', () => {
  it('produces deterministic messages', () => {
    expect(commitMessageFor('publish', 'foo')).toBe('blog: publish foo')
    expect(commitMessageFor('update', 'foo-bar')).toBe('blog: update foo-bar')
    expect(commitMessageFor('delete', 'baz')).toBe('blog: delete baz')
  })
})

describe('adminToCommitAuthor', () => {
  it('builds author from admin email', () => {
    expect(adminToCommitAuthor({ email: 'jane@novelsolar.com' })).toEqual({
      name: 'jane',
      email: 'jane@novelsolar.com',
    })
  })

  it('falls back when admin context is missing', () => {
    const author = adminToCommitAuthor(undefined)
    expect(author.email).toBe('blog@novelsolar.com')
    expect(author.name).toBe('NovelSolar Admin')
  })
})

describe('getRemoteFile', () => {
  it('returns null on 404', async () => {
    mockFetch.mockRejectedValueOnce({ statusCode: 404, data: { message: 'Not Found' } })
    const result = await getRemoteFile('content/blog/missing.md')
    expect(result).toBeNull()
  })

  it('decodes base64 content and returns sha', async () => {
    mockFetch.mockResolvedValueOnce({
      sha: 'abc123',
      content: Buffer.from('hello world', 'utf8').toString('base64'),
      encoding: 'base64',
    })
    const result = await getRemoteFile('content/blog/foo.md')
    expect(result).toEqual({ sha: 'abc123', content: 'hello world' })
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain('/repos/dev-davies/NovelSolar/contents/content/blog/foo.md')
    expect(url).toContain('ref=master')
    expect(init.method).toBe('GET')
    expect(init.headers.Authorization).toBe('Bearer ghp_test_token')
  })

  it('rethrows non-404 GitHub errors as 502', async () => {
    mockFetch.mockRejectedValueOnce({ statusCode: 500, data: { message: 'boom' } })
    await expect(getRemoteFile('content/blog/foo.md')).rejects.toMatchObject({
      statusCode: 502,
      message: expect.stringContaining('boom'),
    })
  })
})

describe('putRemoteFile', () => {
  it('encodes content as base64 and includes sha when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      content: { sha: 'newsha' },
      commit: { sha: 'commit1' },
    })
    const result = await putRemoteFile({
      filePath: 'content/blog/foo.md',
      content: 'hello',
      message: 'blog: update foo',
      author: { name: 'admin', email: 'a@b.c' },
      sha: 'oldsha',
    })
    expect(result).toEqual({ sha: 'newsha', commitSha: 'commit1' })
    const [, init] = mockFetch.mock.calls[0]
    expect(init.method).toBe('PUT')
    expect(init.body.content).toBe(Buffer.from('hello', 'utf8').toString('base64'))
    expect(init.body.sha).toBe('oldsha')
    expect(init.body.branch).toBe('master')
    expect(init.body.committer).toEqual({ name: 'admin', email: 'a@b.c' })
  })

  it('omits sha for new files', async () => {
    mockFetch.mockResolvedValueOnce({
      content: { sha: 'newsha' },
      commit: { sha: 'commit1' },
    })
    await putRemoteFile({
      filePath: 'content/blog/new.md',
      content: 'hi',
      message: 'blog: publish new',
      author: { name: 'admin', email: 'a@b.c' },
    })
    const [, init] = mockFetch.mock.calls[0]
    expect(init.body.sha).toBeUndefined()
  })

  it('surfaces GitHub errors as 502', async () => {
    mockFetch.mockRejectedValueOnce({ statusCode: 422, data: { message: 'Validation failed' } })
    await expect(
      putRemoteFile({
        filePath: 'content/blog/foo.md',
        content: 'hi',
        message: 'blog: publish foo',
        author: { name: 'a', email: 'a@b.c' },
      }),
    ).rejects.toMatchObject({ statusCode: 502 })
  })
})

describe('deleteRemoteFile', () => {
  it('sends DELETE with sha and returns commit sha', async () => {
    mockFetch.mockResolvedValueOnce({ commit: { sha: 'delcommit' } })
    const result = await deleteRemoteFile({
      filePath: 'content/blog/foo.md',
      message: 'blog: delete foo',
      author: { name: 'admin', email: 'a@b.c' },
      sha: 'oldsha',
    })
    expect(result).toEqual({ commitSha: 'delcommit' })
    const [, init] = mockFetch.mock.calls[0]
    expect(init.method).toBe('DELETE')
    expect(init.body.sha).toBe('oldsha')
    expect(init.body.branch).toBe('master')
  })
})

describe('missing token', () => {
  it('throws a configuration error if BLOG_GITHUB_TOKEN is missing', async () => {
    process.env.BLOG_GITHUB_TOKEN = ''
    await expect(getRemoteFile('content/blog/foo.md')).rejects.toMatchObject({
      statusCode: 500,
      message: expect.stringContaining('BLOG_GITHUB_TOKEN'),
    })
  })
})
