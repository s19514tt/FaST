import { nanoid } from "nanoid";
import { HTMLElement, Node, NodeType } from "node-html-parser";
import { Dependent } from "../types/dependent";
import { alphabetId } from "../utils/alphabet_id";

export function findDependencies(
  elm: Node,
  variableNames: string[],
  dependents: Dependent[]
) {
  searchChildAndDependencies(elm, variableNames, dependents);
}

function searchChildAndDependencies(
  elm: Node,
  variableNames: string[],
  dependents: Dependent[]
) {
  if (elm.childNodes.length == 0) {
    const [hasDependent, dependent] = parseRawText(elm, variableNames);
    if (hasDependent) {
      elm.rawText = "";
      elm.parentNode.setAttribute("id", dependent.id);
      dependents.push(dependent as Dependent);
    }
  } else {
    for (let item of elm.childNodes) {
      searchChildAndDependencies(item, variableNames, dependents);
    }
  }
}

function parseRawText(
  elm: Node,
  variableNames: string[]
): [true, Dependent] | [false, null] {
  const rawTxt = elm.rawText;
  const matches = rawTxt.match(/\${ *[a-zA-Z_$][a-zA-Z_$0-9\+\. ]* *}/gm);
  if (!matches) {
    return [false, null];
  } else if (elm.parentNode.nodeType === NodeType.ELEMENT_NODE) {
    const htmlElm = elm.parentNode as HTMLElement;
    let id: string;
    if (htmlElm.hasAttribute("id")) {
      id = htmlElm.getAttribute("id") as string;
    } else {
      id = alphabetId();
    }
    const dependencies: string[] = [];
    for (let item of matches) {
      for (let variableName of variableNames) {
        // FIXME:　空欄
        if (item.includes(variableName)) {
          dependencies.push(variableName);
        }
      }
    }
    const dependent: Dependent = {
      id: id,
      dependingOn: dependencies,
      elementRaw: rawTxt,
    };
    return [true, dependent];
  }
  return [false, null];
}
