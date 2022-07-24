import { VariableDeclaration } from "@typescript-eslint/types/dist/generated/ast-spec";
import { AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import { promises as fs } from "fs";
import { findDependencies } from "./parser/dependency_exploler";
import { divideHtmlBlocks } from "./parser/divide_html_blocks";
import { parseHtml } from "./parser/html_parser";
import { parseJs } from "./parser/js_parser";
import { parseLanguage } from "./parser/language_parser";
import { Dependent } from "./types/dependent";
import { ArgumentParser } from "argparse";

async function main() {
  const parser = new ArgumentParser();
  parser.add_argument("filename", { type: "string" });
  const gp2TextFile = await loadFile(parser.parse_args().filename);
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
  console.log(variableNames);
  findDependencies(parsedHtml, variableNames, dependents);
  console.log(parsedHtml.toString());
  console.log(dependents);
  const dividedHtml = divideHtmlBlocks(parsedHtml);
  console.log("parsed.length", dividedHtml.length);
  dividedHtml.forEach((item) => {
    console.log("elm", item.element.toString());
    console.log("ref", item.ref);
  });
}

async function loadFile(path: string): Promise<string> {
  return await fs.readFile(path, "utf8");
}

main();
