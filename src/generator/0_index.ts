import { HtmlBlock } from "../types/html_block";
import { analyzeBase } from "./walk_elm";
import { generateBaseHtmlAndRenderQueue } from "./gen_base_js";
import { genJs } from "./gen_js";

export function generateJs(
  htmlBlock: HtmlBlock,
  analyzedJsVariables: {
    [key: string]: string;
  }
) {
  //TODO: deep copy here
  analyzeBase(htmlBlock, analyzedJsVariables);
  const queue = generateBaseHtmlAndRenderQueue(htmlBlock);
  return genJs(htmlBlock, queue);
  

  // console.log(htmlBlock.element.toString());
}
