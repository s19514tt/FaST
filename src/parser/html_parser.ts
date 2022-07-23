import { minify } from 'html-minifier'
import parse, { HTMLElement, Node } from 'node-html-parser'

export function parseHtml(html: string): HTMLElement {
  const minifiedHtml = minify(html, {
    collapseWhitespace: true,
  })
  const parsedHtml = parse(minifiedHtml)
  return parsedHtml
}
