import { marked } from 'marked'
import TurndownService from 'turndown'

marked.setOptions({ gfm: true, breaks: false })

let turndown: TurndownService | null = null
function getTurndown() {
  if (!turndown) {
    turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '*',
      emDelimiter: '_',
    })
    turndown.keep(['kbd', 'sub', 'sup'])
  }
  return turndown
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  return marked.parse(markdown, { async: false }) as string
}

export function htmlToMarkdown(html: string): string {
  if (!html) return ''
  return getTurndown().turndown(html).trim()
}
