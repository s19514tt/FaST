import { nanoid } from 'nanoid'
import { Node } from 'node-html-parser'
import { Dependent } from '../types/dependent'

export function findDependencies(
  elm: Node,
  variableNames: string[],
  dependents: Dependent[]
) {
  searchChildAndDependencies(elm, variableNames, dependents)
}

function searchChildAndDependencies(
  elm: Node,
  variableNames: string[],
  dependents: Dependent[]
) {
  if (elm.childNodes.length == 0) {
    const [hasDependent, dependent] = parseRawText(elm.rawText, variableNames)
    if (hasDependent) {
      elm.rawText = ''
      console.log(elm)
      elm.parentNode.setAttribute('id', dependent.nanoid)
      dependents.push(dependent as Dependent)
    }
  } else {
    for (let item of elm.childNodes) {
      searchChildAndDependencies(item, variableNames, dependents)
    }
  }
}

function parseRawText(
  rawTxt: string,
  variableNames: string[]
): [true, Dependent] | [false, null] {
  const matches = rawTxt.match(/\${ *[a-zA-Z_$][a-zA-Z_$0-9\+\. ]* *}/gm)
  if (!matches) {
    return [false, null]
  } else {
    const id = nanoid()
    const dependencies: string[] = []
    for (let item of matches) {
      for (let variableName of variableNames) {
        // FIXME
        if (item.includes(variableName)) {
          dependencies.push(variableName)
        }
      }
    }
    const dependent: Dependent = {
      nanoid: id,
      dependingOn: dependencies,
      elementRaw: rawTxt,
    }
    return [true, dependent]
  }
}
