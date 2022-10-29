import { HTMLElement } from "node-html-parser";
import { HtmlBlock } from "../types/html_block";

export function generateBaseJs(block: HtmlBlock) {
  const first: [string] = [""];
  const renderQueue: {
    parentId: string;
    innerElm: string[];
  }[] = [];
  if (
    (block.element.childNodes[0] as HTMLElement).hasAttribute(
      "manual-5DDspa25gdlBWoWYrDGTT"
    )
  ) {
    let rawString = (block.element.childNodes[0] as HTMLElement).innerHTML;
    const innerElm: string[] = [];
    while (true) {
      const txtNodeRegex = /^(\\place_for_text_node_child-elm\d\\)|<.+?<\/.+?>/;

      const match = rawString.match(txtNodeRegex);
      console.log("match");
      console.log(match);
      if (match != null) {
        innerElm.push(match[0]);
      }
      rawString = rawString.replace(txtNodeRegex, "");
      console.log("rawString");
      console.log(rawString);

      if (rawString == "") {
        break;
      }
    }
    renderQueue.push({
      parentId: (block.element.childNodes[0] as HTMLElement).id,
      innerElm,
    });
    first[0] = (block.element.childNodes[0] as HTMLElement).innerHTML = "";
    (block.element.childNodes[0] as HTMLElement).removeAttribute(
      "manual-5DDspa25gdlBWoWYrDGTT"
    );
  }
  console.log(renderQueue);
  return renderQueue;
}
