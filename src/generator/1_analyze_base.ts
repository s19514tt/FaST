import { HTMLElement } from "node-html-parser";
import { HtmlBlock } from "../types/html_block";
import { RenderInfo } from "../types/render_info";

export function analyzeBase(
  htmlBlock: HtmlBlock,
  condRef: {
    [key: string]: string;
  },
  renderedBlock: RenderInfo
) {
  walkElms(htmlBlock, htmlBlock, condRef, renderedBlock);
}

function walkElms(
  htmlBlock: HtmlBlock,
  baseBlock: HtmlBlock,
  condRef: {
    [key: string]: string;
  },
  renderInfo: RenderInfo
) {
  // console.log("search children" + htmlBlock.ref);
  if (htmlBlock.ref[0] === "Base") {
    searchChildren(htmlBlock, baseBlock, condRef, renderInfo);
  } else if (htmlBlock.ref[0] === "Empty") {
    const trimmedCond = htmlBlock.condition?.trim();
    if (trimmedCond == undefined || !condRef.hasOwnProperty(trimmedCond)) {
      //FIXME: aaa === 1とかでもエラーが出てしまう
      throw Error("Condition is not defined");
    }
    if (condRef[trimmedCond] === "true") {
      // console.log("(baseBlock.element.childNodes[0] as HTMLElement).id");
      // console.log((baseBlock.element.childNodes[0] as HTMLElement).id);
      // console.log(htmlBlock.ref[2]);
      if (
        htmlBlock.ref[2] === (baseBlock.element.childNodes[0] as HTMLElement).id
      ) {
        (baseBlock.element.childNodes[0] as HTMLElement).innerHTML +=
          htmlBlock.element.toString();
      } else {
        /* console.log(
          "htmlBlock.element.getElementById(htmlBlock.ref[2]).innerHTML"
        ); */
        baseBlock.element.getElementById(htmlBlock.ref[2]).innerHTML =
          baseBlock.element.getElementById(htmlBlock.ref[2]).innerHTML +
          htmlBlock.element.toString();
      }
      searchChildren(htmlBlock, baseBlock, condRef, renderInfo);
    } else if (condRef[trimmedCond] === "false") {
      renderInfo.blocksNotToRender.push(htmlBlock.blockId);
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
      searchChildren(htmlBlock, baseBlock, condRef, renderInfo);
    } else {
      baseBlock.element.innerHTML = baseBlock.element.innerHTML.replace(
        `\\place_for_text_node_${htmlBlock.element.id}\\`,
        `<span id="Kn7CY94nJiwy1bSfqOaKW__${htmlBlock.element.id}"></span>`
      );
      if (condRef[trimmedCond] === "false") {
        renderInfo.blocksNotToRender.push(htmlBlock.blockId);
      }
    }
  } else if (htmlBlock.ref[0] === "Element") {
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

      searchChildren(htmlBlock, baseBlock, condRef, renderInfo);
    } else if (condRef[trimmedCond] === "false") {
      renderInfo.blocksNotToRender.push(htmlBlock.blockId);
    }
  }

  // base nodeだけとは限らない
  // manualは全探索する必要がある
  if (
    (htmlBlock.element.childNodes[0] as HTMLElement).removeAttribute != null
  ) {
    (htmlBlock.element.childNodes[0] as HTMLElement).removeAttribute(
      "manual-5DDspa25gdlBWoWYrDGTT"
    );
  }
}

function searchChildren(
  htmlBlock: HtmlBlock,
  baseBlock: HtmlBlock,
  condRef: {
    [key: string]: string;
  },
  renderedBlock: RenderInfo
) {
  renderedBlock.renderedBlock.push(htmlBlock.blockId);
  if (htmlBlock.childHtmlBlocks.length > 0) {
    htmlBlock.childHtmlBlocks.forEach((block) => {
      walkElms(block, baseBlock, condRef, renderedBlock);
    });
  }
}
