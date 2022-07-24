import { HTMLElement, Node, NodeType } from "node-html-parser";
import { Dependent } from "../types/dependent";
import { HtmlBlock } from "../types/html_block";

export function findHtmlBlock(
  dependents: Dependent[],
  htmlBlocks: HtmlBlock[]
) {
  for (let dep of dependents) {
    for (let item of htmlBlocks) {
      const hasIdOnBlock = doesBlockHaveId(dep.id, item.element);
      if (hasIdOnBlock) {
        dep.blockId = item.blockId;
        break;
      }
    }
  }
}

function doesBlockHaveId(id: string, node: Node): boolean {
  if (node.nodeType === NodeType.ELEMENT_NODE) {
    if ((node as HTMLElement).getAttribute("id") === id) {
      return true;
    }
    return (node as HTMLElement).childNodes
      .map((item: Node) => doesBlockHaveId(id, item))
      .some((have) => have);
  }
  return false;
}
