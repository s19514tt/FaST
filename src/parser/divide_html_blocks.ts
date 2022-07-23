import { nanoid } from 'nanoid'
import { HTMLElement, Node, NodeType } from 'node-html-parser'
import { HtmlBlock, RefType } from '../types/html_block'

export function divideHtmlBlocks(elm: HTMLElement): HtmlBlock[] {
  let htmlBlocks: HtmlBlock[] = []
  checkIfHtmlBlock(elm, htmlBlocks)
  htmlBlocks.push({
    blockId: 'base',
    element: elm,
    ref: ['Empty', null],
  })
  return htmlBlocks
}

function checkIfHtmlBlock(elm: HTMLElement, htmlBlock: HtmlBlock[]) {
  if (elm.hasAttribute(':if')) {
    let id: string
    if (elm.hasAttribute('id')) {
      id = elm.getAttribute('id') as string
    } else {
      id = nanoid()
    }
    //refの決め方
    //該当elmが最初のelement→null
    //previousがelement→id
    //previousがtext→textnode→兄弟の構築を手動で行う必要がある
    //previousがelement with if→textnode→兄弟の構築を手動で行う必要がある
    // htmlBlock[id] = elm

    //TODO: Baseも逐次renderingできるようにする

    let refType: RefType
    if (!elm.previousSibling) {
      refType = ['Empty', null]
    } else if (
      elm.previousSibling.nodeType === NodeType.ELEMENT_NODE &&
      (elm.previousSibling as HTMLElement).hasAttribute(':if')
    ) {
      refType = ['TextNode', null]
      markParentAsManualRenderer(elm)
    } else if (elm.previousSibling.nodeType === NodeType.TEXT_NODE) {
      refType = ['TextNode', null]
      markParentAsManualRenderer(elm)
    } else {
      if ((elm.previousSibling as HTMLElement).getAttribute('id')) {
        refType = [
          'Element',
          (elm.previousSibling as HTMLElement).getAttribute('id') as string,
        ]
      } else {
        const newId: string = nanoid()
        ;(elm.previousSibling as HTMLElement).setAttribute('id', newId)
        refType = ['Element', newId]
      }
    }
    elm.remove()
    if (elm.hasAttribute('id')) {
      id = elm.getAttribute('id') as string
    } else {
      id = nanoid()
    }

    htmlBlock.push({
      blockId: nanoid(),
      element: elm,
      ref: refType,
    })

    // htmlBlock[id].childNodes.forEach((node) => {
    //   if (node.nodeType == NodeType.ELEMENT_NODE) {
    //     checkIfHtmlBlock(node as HTMLElement, htmlBlock)
    //   }
    // })
  } else {
    elm.childNodes.forEach((node) => {
      if (node.nodeType == NodeType.ELEMENT_NODE) {
        checkIfHtmlBlock(node as HTMLElement, htmlBlock)
      }
    })
  }
}

function markParentAsManualRenderer(elm: Node) {
  if (
    elm.parentNode &&
    elm.parentNode.nodeType === NodeType.ELEMENT_NODE &&
    !(elm.parentNode as HTMLElement).hasAttribute('5DDspa25gdlBWoWYrDGTT')
  ) {
    ;(elm.parentNode as HTMLElement).setAttribute(
      '5DDspa25gdlBWoWYrDGTT',
      'null'
    )
  }
}
markParentAsManualRenderer
