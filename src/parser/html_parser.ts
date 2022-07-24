import parse, { HTMLElement } from 'node-html-parser'

export function parseHtml(html: string): HTMLElement {
  const minifiedHtml = minifyHtml(html)
  const parsedHtml = parse(minifiedHtml.toString())
  return parsedHtml
}

function minifyHtml(html: string) {
  return html.replace(/(^ *)|(\n)|((?<=>) +)/gm, '')
}
