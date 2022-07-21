import {
  Identifier,
  VariableDeclaration,
} from '@typescript-eslint/types/dist/generated/ast-spec'
import { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree'
import { promises as fs } from 'fs'
import { findDependencies } from './parser/dependency_exploler'
import { parseHtml } from './parser/html_parser'
import { parseJs } from './parser/js_parser'
import { parseLanguage } from './parser/language_parser'
import { Dependent } from './types/dependent'

async function main() {
  const a = await loadFile('test1.gp2')
  // console.log(a)
  const languageParsed = parseLanguage(a)
  console.log(languageParsed)
  const parsedHtml = parseHtml(languageParsed['html'])
  const dependents: Dependent[] = []
  const parsedJs = parseJs(languageParsed['script'])
  const variableNames = parsedJs.body
    .filter((item): item is VariableDeclaration => {
      return item.type == AST_NODE_TYPES.VariableDeclaration
    })
    .flatMap((item) => {
      return item.declarations.map((item) => {
        console.log(item)
        if (item.id.type === AST_NODE_TYPES.Identifier) {
          return item.id.name
        }
      })
    })
    .filter((item): item is string => {
      return !!item
    })
  console.log(variableNames)
  findDependencies(parsedHtml, variableNames, dependents)
  console.log(parsedHtml.toString())
  console.log(dependents)
}

async function loadFile(path: string): Promise<string> {
  return await fs.readFile(path, 'utf8')
}

main()
