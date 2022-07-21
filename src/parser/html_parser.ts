import parse, { HTMLElement, Node } from 'node-html-parser'

export function parseHtml(html: string): HTMLElement {
  const parsedHtml = parse(html)
  return parsedHtml
}

