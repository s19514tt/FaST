import { HtmlBlock } from "../types/html_block";
import { analyzeBase } from "./walk_elm";
import parse, { HTMLElement } from "node-html-parser";
import { generateBaseJs } from "./gen_base_js";

export function generateJs(htmlBlock: HtmlBlock) {
  //TODO: deep copy here
  analyzeBase(htmlBlock);
  // console.log("htmlBlock.element.toString()");
  // console.log(htmlBlock.element.toString());
  // const parsed = parse(htmlBlock.element.toString());
  //'<div id="parent-elm" manual-5DDspa25gdlBWoWYrDGTT>\place_for_text_node_child-elm1\<div id="child-elm1"></div>\place_for_text_node_child-elm2\</div><div id="child-elm3"></div>'
  const queue = generateBaseJs(htmlBlock);

  console.log(htmlBlock.element.toString());
}
