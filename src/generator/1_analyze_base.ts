import { HTMLElement } from "node-html-parser";
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
  }
) {
  if (htmlBlock.ref[0] === "Base") {
  } else if (htmlBlock.ref[0] === "Empty") {
    const trimmedCond = htmlBlock.condition?.trim();
    if (trimmedCond == undefined || !condRef.hasOwnProperty(trimmedCond)) {
      // aaa === 1とかでもエラーが出てしまう
      throw Error("Condition is not defined");
    }
    if (condRef[trimmedCond] === "true") {
      console.log("(baseBlock.element.childNodes[0] as HTMLElement).id");
      console.log((baseBlock.element.childNodes[0] as HTMLElement).id);
      console.log(htmlBlock.ref[2]);
      if (
        htmlBlock.ref[2] === (baseBlock.element.childNodes[0] as HTMLElement).id
      ) {
        (baseBlock.element.childNodes[0] as HTMLElement).innerHTML +=
          htmlBlock.element.toString();
      } else {
        console.log(
          "htmlBlock.element.getElementById(htmlBlock.ref[2]).innerHTML"
        );
        baseBlock.element.getElementById(htmlBlock.ref[2]).innerHTML =
          baseBlock.element.getElementById(htmlBlock.ref[2]).innerHTML +
          htmlBlock.element.toString();
      }
    }
  } else if (htmlBlock.ref[0] === "TextNode") {
    const trimmedCond = htmlBlock.condition?.trim();
    if (trimmedCond == undefined || !condRef.hasOwnProperty(trimmedCond)) {
      throw Error(`Condition "${trimmedCond}" is not defined`);
    }
    if (condRef[trimmedCond] === "true") {
      baseBlock.element.innerHTML = baseBlock.element.innerHTML.replace(
        `\\place_for_text_node_${htmlBlock.element.id}\\`,
        `<span id="Kn7CY94nJiwy1bSfqOaKW__${
          htmlBlock.element.id
        }"></span>${htmlBlock.element.toString()}`
      );
    }
  } else if (htmlBlock.ref[0] === "Element") {
    //FIXME:
    const trimmedCond = htmlBlock.condition?.trim();
    if (trimmedCond == undefined || !condRef.hasOwnProperty(trimmedCond)) {
      throw Error(`Condition "${trimmedCond}" is not defined`);
    }
    if (condRef[trimmedCond] === "true") {
      const ind = baseBlock.element.childNodes[0].childNodes.findIndex(
        (item) => (item as HTMLElement).id === htmlBlock.ref[1]
      );

      baseBlock.element.childNodes[0].childNodes.splice(
        ind,
        0,
        htmlBlock.element
      );
    }
  }

  // base nodeだけとは限らない
  // manualは全探索する必要がある
  if((htmlBlock.element.childNodes[0] as HTMLElement).removeAttribute!=null){
    (htmlBlock.element.childNodes[0] as HTMLElement).removeAttribute(
      "manual-5DDspa25gdlBWoWYrDGTT"
    );
  }
  if (htmlBlock.childHtmlBlocks.length > 0) {
    htmlBlock.childHtmlBlocks.forEach((block) => {
      walkElms(block, baseBlock, condRef);
    });
  }
}
