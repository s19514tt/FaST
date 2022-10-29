import { HtmlBlock } from "../types/html_block";
import { analyzeBase } from "./walk_elm";
import { generateBaseJs } from "./gen_base_js";

export function generateJs(
  htmlBlock: HtmlBlock,
  analyzedJsVariables: {
    [key: string]: string;
  }
) {
  //TODO: deep copy here
  analyzeBase(htmlBlock, analyzedJsVariables);
  const queue = generateBaseJs(htmlBlock);

  console.log(htmlBlock.element.toString());
}
