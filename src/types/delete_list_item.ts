import { HTMLElement } from 'node-html-parser'

export type DeleteListItem = {
  elm: HTMLElement
  isDependencyNewTextNode: boolean
  blockName: string
}
