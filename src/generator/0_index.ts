import { HtmlBlock } from "../types/html_block";
import { RenderInfo } from "../types/render_info";
import { analyzeBase } from "./1_analyze_base";
import { generateBaseHtmlAndRenderQueue } from "./2_gen_base_html";
import { genJs } from "./3_gen_js";

export function generateJs(
  htmlBlock: HtmlBlock,
  analyzedJsVariables: {
    [key: string]: string;
  },
  jsCode: string
) {
  //TODO: deep copy here

  const blockRenderInfo: RenderInfo = {
    renderedBlock: [],
    blocksNotToRender: [],
  };

  analyzeBase(htmlBlock, analyzedJsVariables, blockRenderInfo);
  // console.log(htmlBlock.element.toString());
  // const queue = generateBaseHtmlAndRenderQueue(htmlBlock);
  return genJs(htmlBlock, blockRenderInfo,jsCode);
}
