import { nanoid } from 'nanoid'
import { HTMLElement, Node, NodeType } from 'node-html-parser'
import { HtmlBlock, RefType } from '../types/html_block'

export function divideHtmlBlocks(elm: HTMLElement): HtmlBlock[] {
  let htmlBlocks: HtmlBlock[] = []
  checkIfHtmlBlock(elm, htmlBlocks)
  // htmlBlock['base'] = elm
  return htmlBlocks
}

function checkIfHtmlBlock(elm: HTMLElement, htmlBlock: HtmlBlock[]) {
  if (elm.hasAttribute('if')) {
    let id: string
    if (elm.hasAttribute('id')) {
      id = elm.getAttribute('id') as string
    } else {
      id = nanoid()
    }
    //refの決め方
    //previousがelement→id
    //previousがtext→textnode→兄弟の構築を手動で行う必要がある
    //previousがelement with if→textnode→兄弟の構築を手動で行う必要がある
    // htmlBlock[id] = elm
    
    let refType:RefType;
    if(!elm.previousSibling){
      refType = ['Empty',null]
    }else if(elm.previousSibling){

    }
    elm.innerHTML = ''//elementを削除する
    if (elm.hasAttribute('id')) {
      id = elm.getAttribute('id') as string
    } else {
      id = nanoid()
    }

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
