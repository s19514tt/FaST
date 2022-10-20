import parse, { HTMLElement } from "node-html-parser";
import { HtmlBlock } from "../types/html_block";

export function analyzeBase(htmlBlock: HtmlBlock) {
  walkElms(htmlBlock, htmlBlock);
}

function walkElms(
  htmlBlock: HtmlBlock,
  baseBlock: HtmlBlock,
  parentBlock?: HtmlBlock
) {
  //FIXME:解析できるようにする
  const condRef: { [key: string]: string } = {
    show1: "true",
    show2: "false",
    show3: "true",
  };
  htmlBlock.element = parse(htmlBlock.element.toString());
  if (htmlBlock.ref[0] === "Base") {
  } else if (htmlBlock.ref[0] === "Empty") {
    const trimmedCond = htmlBlock.condition?.trim();
    if (trimmedCond == undefined || !condRef.hasOwnProperty(trimmedCond)) {
      throw Error("Condition is not defined");
    }
    console.log(`A:condRef[trimmedCond] === "true"`);
    console.log(condRef[trimmedCond] === "true");
    // @ts-ignore
    if (condRef[trimmedCond] === "true") {
      //FIXME:
      (baseBlock.element.childNodes[0] as HTMLElement).innerHTML +=
        htmlBlock.element.toString();
    }
  } else if (htmlBlock.ref[0] === "TextNode") {
    const trimmedCond = htmlBlock.condition?.trim();
    if (trimmedCond == undefined || !condRef.hasOwnProperty(trimmedCond)) {
      throw Error("Condition is not defined");
    }
    console.log(`condRef[trimmedCond] === "true"`);
    console.log(condRef[trimmedCond] === "true");
    if (condRef[trimmedCond] === "true") {
      baseBlock.element.innerHTML = baseBlock.element.innerHTML.replace(
        `\\place_for_text_node_${
          (htmlBlock.element.childNodes[0] as HTMLElement).id
        }\\`,
        `\\place_for_text_node_${
          (htmlBlock.element.childNodes[0] as HTMLElement).id
        }\\${htmlBlock.element.toString()}`
      );
    }
  } else if (htmlBlock.ref[0] === "Element") {
    //FIXME:
    const trimmedCond = htmlBlock.condition?.trim();
    if (trimmedCond == undefined || !condRef.hasOwnProperty(trimmedCond)) {
      throw Error("Condition is not defined");
    }
    console.log(`A:condRef[trimmedCond] === "true"`);
    console.log(condRef[trimmedCond] === "true");
    // @ts-ignore
    if (condRef[trimmedCond] === "true") {
      //FIXME:
      baseBlock.element.innerHTML += htmlBlock.element.toString();
    }
  }
  if (htmlBlock.childHtmlBlocks.length > 0) {
    htmlBlock.childHtmlBlocks.forEach((block) => {
      walkElms(block, baseBlock, htmlBlock);
    });
  }
}
