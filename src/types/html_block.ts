import { HTMLElement } from 'node-html-parser'

export type RefType = ['Element', string] | ['Empty', null] | ['TextNode', null]

export type HtmlBlock = {
  blockId: string
  element: HTMLElement
  ref: RefType
}
