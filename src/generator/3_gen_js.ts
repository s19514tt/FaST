import { customAlphabet, nanoid } from "nanoid";
import { HtmlBlock } from "../types/html_block";
import { RenderQueue } from "../types/render_queue";
import { alphabetId } from "../utils/alphabet_id";

export function genJs(htmlBlock: HtmlBlock) {
  let js = "";
  js += `document.body.innerHTML = \`${htmlBlock.element.toString()}\`
`;

  return js;
}

/* parent = document.getElementById('parent-elm')
  a = document.createTextNode('')
  parent.innerHtml = a
  parent.insertBefore(document.createTextNode(''), document.getElementById(${"先行elm"})) */
