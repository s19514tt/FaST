import { minify } from 'html-minifier'
import parse, { HTMLElement, Node } from 'node-html-parser'

export function parseHtml(html: string): HTMLElement {
  // const minifiedHtml = minify(html)
  const parsedHtml = parse(html)
  console.log((parsedHtml.childNodes[1] as HTMLElement).rawAttributes)
  return parsedHtml
}
