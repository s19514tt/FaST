import {
  AST,
  parse,
  TSESTreeOptions,
} from "@typescript-eslint/typescript-estree";

export function parseJs(js: string): AST<TSESTreeOptions> {
  const parsedJs = parse(js);
  return parsedJs;
}
