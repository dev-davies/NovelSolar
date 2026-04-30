import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal('createError', (opts: { statusCode: number, statusMessage: string }) => {
  const err = new Error(opts.statusMessage) as any
  err.statusCode = opts.statusCode
  return err
})

import {
  isValidSlug,
  parseMarkdownFile,
  serializePost,
} from './blogContent'

describe('isValidSlug', () => {
  it('accepts lowercase dash-separated slugs', () => {
    expect(isValidSlug('solar-101')).toBe(true)
    expect(isValidSlug('itel-power-tank')).toBe(true)
    expect(isValidSlug('a')).toBe(true)
    expect(isValidSlug('post-2026-03-04')).toBe(true)
  })

  it('rejects empty, uppercase, leading/trailing dashes, double dashes, spaces, and special chars', () => {
    expect(isValidSlug('')).toBe(false)
    expect(isValidSlug('Solar-101')).toBe(false)
    expect(isValidSlug('-solar')).toBe(false)
    expect(isValidSlug('solar-')).toBe(false)
    expect(isValidSlug('solar--power')).toBe(false)
    expect(isValidSlug('solar power')).toBe(false)
    expect(isValidSlug('solar/power')).toBe(false)
    expect(isValidSlug('solar.md')).toBe(false)
  })

  it('rejects non-strings and overlong slugs', () => {
    expect(isValidSlug(undefined)).toBe(false)
    expect(isValidSlug(null)).toBe(false)
    expect(isValidSlug(123 as any)).toBe(false)
    expect(isValidSlug('a'.repeat(97))).toBe(false)
  })
})

describe('parseMarkdownFile', () => {
  it('extracts frontmatter, normalizes draft to boolean, and preserves body', () => {
    const raw = `---\ntitle: Hello World\ndate: '2026-03-04'\ncategory: Inverter\nauthor: Editorial\ndraft: false\n---\n\nBody paragraph.\n\n## Heading\n`
    const post = parseMarkdownFile(raw, 'hello-world')
    expect(post.slug).toBe('hello-world')
    expect(post.frontmatter.title).toBe('Hello World')
    expect(post.frontmatter.date).toBe('2026-03-04')
    expect(post.frontmatter.category).toBe('Inverter')
    expect(post.frontmatter.author).toBe('Editorial')
    expect(post.frontmatter.draft).toBe(false)
    expect(post.body).toContain('Body paragraph.')
    expect(post.body).toContain('## Heading')
  })

  it('treats missing draft field as false (published)', () => {
    const raw = `---\ntitle: Untagged\ndate: '2026-03-04'\n---\n\nBody.\n`
    const post = parseMarkdownFile(raw, 'untagged')
    expect(post.frontmatter.draft).toBe(false)
  })

  it('treats draft: true as true', () => {
    const raw = `---\ntitle: WIP\ndate: '2026-03-04'\ndraft: true\n---\n\nBody.\n`
    const post = parseMarkdownFile(raw, 'wip')
    expect(post.frontmatter.draft).toBe(true)
  })

  it('throws if title is missing or empty', () => {
    const raw = `---\ndate: '2026-03-04'\n---\n\nBody.\n`
    expect(() => parseMarkdownFile(raw, 'no-title')).toThrow()
  })

  it('falls back to today for missing date', () => {
    const raw = `---\ntitle: NoDate\n---\n\nBody.\n`
    const post = parseMarkdownFile(raw, 'no-date')
    expect(post.frontmatter.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('serializePost', () => {
  it('round-trips through parseMarkdownFile preserving fields', () => {
    const original = {
      frontmatter: {
        title: 'Round Trip',
        description: 'desc',
        excerpt: 'short',
        date: '2026-03-04',
        image: '/images/x.jpg',
        category: 'Inverter',
        author: 'Editorial',
        draft: true,
      },
      body: 'Hello body.\n\n## Heading\n\n* one\n* two',
    }
    const serialized = serializePost(original)
    const reparsed = parseMarkdownFile(serialized, 'round-trip')
    expect(reparsed.frontmatter).toMatchObject(original.frontmatter)
    expect(reparsed.body).toContain('Hello body.')
    expect(reparsed.body).toContain('## Heading')
    expect(reparsed.body).toContain('* one')
  })

  it('omits empty frontmatter fields and keeps draft: false explicit', () => {
    const serialized = serializePost({
      frontmatter: {
        title: 'Minimal',
        date: '2026-03-04',
        draft: false,
      },
      body: 'Body.',
    })
    expect(serialized).toContain('title: Minimal')
    expect(serialized).toContain('draft: false')
    expect(serialized).not.toContain('description:')
    expect(serialized).not.toContain('excerpt:')
    expect(serialized).not.toContain('image:')
    expect(serialized).not.toContain('category:')
    expect(serialized).not.toContain('author:')
  })
})
