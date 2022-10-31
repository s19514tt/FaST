import { customAlphabet, nanoid } from "nanoid";
import { HtmlBlock } from "../types/html_block";
import { RenderQueue } from "../types/render_queue";

export function genJs(htmlBlock: HtmlBlock, renderQueues: RenderQueue[]) {
  let js = "";
  js += `document.body.innerHTML = \`${htmlBlock.element.toString()}\`
`;
  for (const queue of renderQueues) {
    const parentElmKey = customAlphabet("abcdefghijklmnopqrstuvwxyz", 10)();
    js += `const ${parentElmKey} = document.querySelector('#${queue.parentId}')
`;
    for (const innerElm of queue.innerElm) {
      if (innerElm.startsWith("\\place_for_text_node_")) {
        const elmSubstituteName = customAlphabet(
          "abcdefghijklmnopqrstuvwxyz",
          10
        )();
        js += `${elmSubstituteName} = document.createTextNode('')
${parentElmKey}.insertBefore(${elmSubstituteName},null)
`;
      } else {
        js += `${parentElmKey}.innerHTML += \`${innerElm}\`
`;
      }
    }
  }

  return js;
}

/* parent = document.getElementById('parent-elm')
  a = document.createTextNode('')
  parent.innerHtml = a
  parent.insertBefore(document.createTextNode(''), document.getElementById(${"先行elm"})) */
