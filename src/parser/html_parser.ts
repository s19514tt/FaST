import { minify } from 'html-minifier'
import parse, { HTMLElement, Node } from 'node-html-parser'

export function parseHtml(html: string): HTMLElement {
  const minifiedHtml = minify(html, {
    collapseWhitespace: true,
  })
  const parsedHtml = parse(minifiedHtml)
  console.log((parsedHtml as HTMLElement).attributes)
  ;(parsedHtml as HTMLElement).setAttribute('a', 'b')
  console.log((parsedHtml as HTMLElement).attributes)
  console.log((parsedHtml as HTMLElement).toString())
  console.log(minifiedHtml)
  const a = parse("<p id='show1' :if='show1'>${message+message2}</p>")
  //@ts-ignore
  parsedHtml.childNodes[0].setAttribute('a', 'b')
  //@ts-ignore
  console.log(parsedHtml.childNodes[0].attrs)
  console.log(parsedHtml.childNodes[0].toString())
  //@ts-ignore
  console.log(a.childNodes[0].attrs)
  return parsedHtml
}
