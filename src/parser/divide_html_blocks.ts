import { nanoid } from "nanoid";
import { HTMLElement, Node, NodeType } from "node-html-parser";
import { DeleteListItem } from "../types/delete_list_item";
import { HtmlBlock, RefType } from "../types/html_block";

export function divideHtmlBlocks(elm: HTMLElement): HtmlBlock[] {
  let htmlBlocks: HtmlBlock[] = [];
  let elementsToDelete: DeleteListItem[] = [];
  checkIfHtmlBlock(elm, htmlBlocks, elementsToDelete);
  htmlBlocks.push({
    blockId: "base",
    element: elm,
    ref: ["Empty", null],
  });
  elementsToDelete.forEach((item) => {
    if (item.isDependencyNewTextNode) {
      item.elm.replaceWith(`place_for_text_node_${item.blockName}`);
    } else {
      item.elm.remove();
    }
  });
  return htmlBlocks;
}

function checkIfHtmlBlock(
  elm: HTMLElement,
  htmlBlock: HtmlBlock[],
  elementsToDelete: DeleteListItem[]
) {
  if (elm.hasAttribute(":if")) {
    let id: string;
    if (elm.hasAttribute("id")) {
      id = elm.getAttribute("id") as string;
    } else {
      id = nanoid();
    }
    //refの決め方
    //該当elmが最初のelement→null
    //previousがelement→id
    //previousがtext→textnode→兄弟の構築を手動で行う必要がある
    //previousがelement with if→textnode→兄弟の構築を手動で行う必要がある
    // htmlBlock[id] = elm

    //TODO: Baseも逐次renderingできるようにする

    let isDependencyNewTextNode = false;

    let refType: RefType;
    if (!elm.nextSibling) {
      refType = ["Empty", null];
    } else if (
      elm.nextSibling.nodeType === NodeType.ELEMENT_NODE &&
      (elm.nextSibling as HTMLElement).hasAttribute(":if")
    ) {
      refType = ["TextNode", null];
      markParentAsManualRenderer(elm);
      isDependencyNewTextNode = true;
    } else if (elm.nextSibling.nodeType === NodeType.TEXT_NODE) {
      throw Error("If block must not be a sibling of a text node");
      // 禁止実装なのでとりあえずここが実行されることはないはず
      /* refType = ['TextNode', null]
      markParentAsManualRenderer(elm) */
    } else {
      if ((elm.nextSibling as HTMLElement).getAttribute("id")) {
        refType = [
          "Element",
          (elm.nextSibling as HTMLElement).getAttribute("id") as string,
        ];
      } else {
        const newId: string = nanoid();
        (elm.nextSibling as HTMLElement).setAttribute("id", newId);
        refType = ["Element", newId];
      }
    }
    if (elm.hasAttribute("id")) {
      id = elm.getAttribute("id") as string;
    } else {
      id = nanoid();
    }
    elementsToDelete.push({
      elm: elm,
      isDependencyNewTextNode: isDependencyNewTextNode,
      blockName: id,
    });

    htmlBlock.push({
      blockId: nanoid(),
      element: elm,
      ref: refType,
    });
  }
  elm.childNodes.forEach((node) => {
    if (node.nodeType == NodeType.ELEMENT_NODE) {
      checkIfHtmlBlock(node as HTMLElement, htmlBlock, elementsToDelete);
    }
  });
}

function markParentAsManualRenderer(elm: Node) {
  if (
    elm.parentNode &&
    elm.parentNode.nodeType === NodeType.ELEMENT_NODE &&
    !(elm.parentNode as HTMLElement).hasAttribute("5DDspa25gdlBWoWYrDGTT")
  ) {
    (elm.parentNode as HTMLElement).setAttribute(
      "manual-5DDspa25gdlBWoWYrDGTT",
      ""
    );
  }
}
