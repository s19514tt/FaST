import parse, { HTMLElement } from "node-html-parser";
import { HtmlBlock } from "../types/html_block";

export function analyzeBase(
  htmlBlock: HtmlBlock,
  condRef: {
    [key: string]: string;
  }
) {
  walkElms(htmlBlock, htmlBlock, condRef);
}

function walkElms(
  htmlBlock: HtmlBlock,
  baseBlock: HtmlBlock,
  condRef: {
    [key: string]: string;
  },
  parentBlock?: HtmlBlock
) {
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
      console.log(
        baseBlock.element.childNodes[0].childNodes.map(
          (item) => (item as HTMLElement).id
        )
      );
      const ind = baseBlock.element.childNodes[0].childNodes.findIndex(
        (item) => (item as HTMLElement).id === htmlBlock.ref[1]
      );

      console.log(ind);

      baseBlock.element.childNodes[0].childNodes.splice(
        ind,
        0,
        htmlBlock.element
      );

      /* (
        //FIXME:
        baseBlock.element.childNodes[0] as HTMLElement
      ).innerHTML += htmlBlock.element.toString(); */
    }
  }
  if (htmlBlock.childHtmlBlocks.length > 0) {
    htmlBlock.childHtmlBlocks.forEach((block) => {
      walkElms(block, baseBlock, condRef, htmlBlock);
    });
  }
}
