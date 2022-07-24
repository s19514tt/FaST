import { VariableDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { findDependencies } from "./dependency_exploler";
import { divideHtmlBlocks } from "./divide_html_blocks";
import { parseHtml } from "./html_parser";
import { parseJs } from "./js_parser";
import { parseLanguage } from "./language_parser";
import { Dependent } from "../types/dependent";

export function parseGp2File(gp2TextFile: string) {
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
  // console.log(variableNames);
  findDependencies(parsedHtml, variableNames, dependents);
  const dividedHtml = divideHtmlBlocks(parsedHtml);
  dividedHtml.forEach((item) => {
    console.log("----------------------------");
    console.log("elm", item.element.toString());
    console.log("ref", item.ref);
    console.log("cond", item.condition ?? "no condition");
    console.log("parent", item.parentBlockId ?? "no parent");
    console.log("block", item.blockId);
  });
  console.log("----------------------------");
  console.log(dependents);
}
