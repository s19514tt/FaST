import { VariableDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { findDependencies } from "./dependency_exploler";
import { divideHtmlBlocks } from "./divide_html_blocks";
import { parseHtml } from "./html_parser";
import { parseJs } from "./js_parser";
import { parseLanguage } from "./language_parser";
import { Dependent } from "../types/dependent";
import { findHtmlBlock as findHtmlBlockOfDeps } from "./find_html_block";
import { findChildBlocksFromBase } from "./find_child_blocks";
import { HtmlBlock } from "../types/html_block";
import { extractJavaScriptVariableInitialValue } from "../utils/extract_initial_value";

export function parseGp2File(gp2TextFile: string): [
  HtmlBlock,
  {
    [key: string]: string;
  }
] {
  const languageParsed = parseLanguage(gp2TextFile);
  const parsedHtml = parseHtml(languageParsed["html"]);
  const dependents: Dependent[] = [];
  const parsedJs = parseJs(languageParsed["script"]);
  const variableNames = parsedJs.body
    .filter((item): item is VariableDeclaration => {
      return item.type == AST_NODE_TYPES.VariableDeclaration;
    })
    .flatMap((item) => {
      return item.declarations.map((item) => {
        if (item.id.type === AST_NODE_TYPES.Identifier) {
          return item.id.name;
        }
      });
    })
    .filter((item): item is string => {
      return !!item;
    });
  const variables = extractJavaScriptVariableInitialValue(
    languageParsed["script"]
  );
  // console.log(variableNames);
  findDependencies(parsedHtml, variableNames, dependents);
  const dividedHtml = divideHtmlBlocks(parsedHtml);
  findHtmlBlockOfDeps(dependents, dividedHtml);
  const base = findChildBlocksFromBase(dividedHtml);
  printHtmlBlock(base);
  return [base, variables];
  // console.log("----------------------------");
}

function printHtmlBlock(item: HtmlBlock) {
  console.log("----------------------------");
  console.log("elm", item.element.toString());
  console.log("ref", item.ref);
  console.log("cond", item.condition ?? "no condition");
  // console.log("parent", item.parentBlockId ?? "no parent");
  console.log("block", item.blockId);
  console.log("deps", item.dependencies);
  console.log("childs");
  item.childHtmlBlocks.map((child) => printHtmlBlock(child));
  console.log("----------------------------");
}
