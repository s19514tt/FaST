import { HtmlBlock } from "../types/html_block";

export function findChildBlocksFromBase(htmlBlocks: HtmlBlock[]): HtmlBlock {
  const base = htmlBlocks.find((item) => item.blockId === "base");
  if (base === undefined) {
    throw Error("base html block doesn't exist");
  }
  findChildBlocks(base, htmlBlocks);
  return base;
}

function findChildBlocks(parentBlock: HtmlBlock, blocks: HtmlBlock[]) {
  const childBlocks = blocks.filter(
    (block) => block.parentBlockId === parentBlock.blockId
  );
  parentBlock.childHtmlBlocks = childBlocks;
  childBlocks.map((child) => findChildBlocks(child, blocks));
}
