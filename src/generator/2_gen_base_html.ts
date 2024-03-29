import { HTMLElement } from "node-html-parser";
import { HtmlBlock } from "../types/html_block";
import { RenderQueue } from "../types/render_queue";

export function generateBaseHtmlAndRenderQueue(block: HtmlBlock) {
  const first: [string] = [""];
  const renderQueue: RenderQueue[] = [];
  if (
    (block.element.childNodes[0] as HTMLElement).hasAttribute(
      "manual-5DDspa25gdlBWoWYrDGTT"
    )
  ) {
    let rawString = (block.element.childNodes[0] as HTMLElement).innerHTML;
    const innerElm: string[] = [];
    while (true) {
      const txtNodeRegex = /^(\\place_for_text_node_.+\\)|<.+?<\/.+?>/;

      const match = rawString.match(txtNodeRegex);
      if (match != null) {
        const isLastElmAndNewElmHTML = () => {
          if (match[0].startsWith("\\place_for_text_node_")) {
            return false;
          } else {
            if (innerElm.length > 0) {
              const lastElm = innerElm[innerElm.length - 1];
              return !lastElm.startsWith("\\place_for_text_node_");
            } else {
              return false;
            }
          }
        };
        if (isLastElmAndNewElmHTML()) {
          innerElm[innerElm.length - 1] += match[0];
        } else {
          innerElm.push(match[0]);
        }
      }
      rawString = rawString.replace(txtNodeRegex, "");

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
  return renderQueue;
}
