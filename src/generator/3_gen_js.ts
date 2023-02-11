import { printHtmlBlock } from "../parser/0_index";
import { HtmlBlock } from "../types/html_block";
import { RenderInfo } from "../types/render_info";

export function genJs(
  htmlBlock: HtmlBlock,
  renderInfo: RenderInfo,
  jsCode: string
): string {
  let js = jsCode;
  // js += genRenderFunc(htmlBlock);
  js += `document.body.innerHTML = \`${htmlBlock.element.toString()}\`
`;
  // js.replace(/Kn(7CY94n/gm, "Kn7CY94n");

  // list all strings between Kn7CY94nJiwy1bSfqOaKW__ and " from js
  const regex = /Kn7CY94nJiwy1bSfqOaKW__(.*?)"/gm;
  const matches = js.matchAll(regex);
  for (const match of matches) {
    const findHtmlBlockFromId = (
      id: string,
      block: HtmlBlock
    ): HtmlBlock | null => {
      if (block.element.id === id) {
        return block;
      } else {
        for (const child of block.childHtmlBlocks) {
          const found = findHtmlBlockFromId(id, child);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
    const foundHtmlBlock = findHtmlBlockFromId(match[1], htmlBlock);
    if (!foundHtmlBlock) {
      throw Error(`HtmlBlock with id ${match[1]} is not found`);
    }
    js = js.replace(
      `<span id="Kn7CY94nJiwy1bSfqOaKW__${match[1]}"></span>`,
      `<span id="Kn7CY94nJiwy1bSfqOaKW__${match[1]}"></span>\${${
        foundHtmlBlock.condition
      }?\`${foundHtmlBlock.element.toString()}\`:""}`
    );
  }

  return js;
}

function genIfBlock(htmlBlock: HtmlBlock, renderInfo: RenderInfo): string {
  const childIfBlocks = htmlBlock.childHtmlBlocks
    .map((block) => {
      return genIfBlock(block, renderInfo);
    })
    .join("\n");
  const isAlreadyRendered = renderInfo.renderedBlock.includes(
    htmlBlock.blockId
  );
  const notToRender = renderInfo.blocksNotToRender.includes(htmlBlock.blockId);
  if (notToRender) {
    // console.log("isAlreadyRendered || notToRender");
    return "";
  }
  if (isAlreadyRendered) {
    return `${childIfBlocks}
`;
  }
  return `if(${htmlBlock.condition}){
  render__${htmlBlock.blockId}()
  ${childIfBlocks}
}`;
}

function genRenderFunc(htmlBlock: HtmlBlock): string {
  if (htmlBlock.ref[0] === "Base") {
    const childRenderFunc = htmlBlock.childHtmlBlocks
      .map((block) => {
        return genRenderFunc(block);
      })
      .join("\n");
    return childRenderFunc;
  }
  let code = `function render__${htmlBlock.blockId}(){`;
  if (htmlBlock.ref[0] === "TextNode") {
    // create new node
    code += `const $ = document.createElement(\`${htmlBlock.element.tagName.toLowerCase()}\`);`;
    code += `$.innerHTML = \`${htmlBlock.element.innerHTML}\`;`;
    // set attribute
    Object.keys(htmlBlock.element.rawAttributes).forEach((key) => {
      code += `$.setAttribute(\`${key}\`, \`${htmlBlock.element.rawAttributes[key]}\`);\n`;
    });
    code += `document.getElementById(\`${htmlBlock.ref[2]}\`).insertBefore($,document.getElementById(\`Kn7CY94nJiwy1bSfqOaKW__${htmlBlock.element.id}\`));`;
    code += `}`;
    const childRenderFunc = htmlBlock.childHtmlBlocks
      .map((block) => {
        return genRenderFunc(block);
      })
      .join("\n");
    return `${childRenderFunc}\n${code}`;
  } else if (htmlBlock.ref[0] === "Element") {
    code += `const $ = document.createElement(\`${htmlBlock.element.tagName.toLowerCase()}\`);`;
    code += `$.innerHTML = \`${htmlBlock.element.innerHTML}\`;`;
    Object.keys(htmlBlock.element.rawAttributes).forEach((key) => {
      code += `$.setAttribute(\`${key}\`, \`${htmlBlock.element.rawAttributes[key]}\`);\n`;
    });
    code += `document.getElementById(\`${htmlBlock.ref[2]}\`).insertBefore($,document.getElementById(\`${htmlBlock.ref[1]}\`));`;
    code += `}`;

    const childRenderFunc = htmlBlock.childHtmlBlocks
      .map((block) => {
        return genRenderFunc(block);
      })
      .join("\n");
    return `${code}\n${childRenderFunc}`;
  } else {
    code += `const $ = document.createElement(\`${htmlBlock.element.tagName.toLowerCase()}\`);`;
    code += `$.innerHTML = \`${htmlBlock.element.innerHTML}\`;`;
    Object.keys(htmlBlock.element.rawAttributes).forEach((key) => {
      code += `$.setAttribute(\`${key}\`, \`${htmlBlock.element.rawAttributes[key]}\`);\n`;
    });
    code += `document.getElementById(\`${htmlBlock.ref[2]}\`).insertBefore($,null);`;
    code += `}`;

    const childRenderFunc = htmlBlock.childHtmlBlocks
      .map((block) => {
        return genRenderFunc(block);
      })
      .join("\n");
    return `${childRenderFunc}\n${code}`;
  }

  /* let code = ``;
    id = alphabetId();
    code += `document.getElementById("Kn7CY94nJiwy1bSfqOaKW__child-elm3${htmlBlock.ref[1]}").textContent = ${htmlBlock.ref[2]};`;
  }
  return `const ${id} = document.getElementById("${htmlBlock.ref[2]}");
${id}.innerHTML = \`${htmlBlock.element.toString()}\`
`; */
}

/* parent = document.getElementById('parent-elm')
  a = document.createTextNode('')
  parent.innerHtml = a
  parent.insertBefore(document.createTextNode(''), document.getElementById(${"先行elm"})) */
