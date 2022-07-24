import { parse } from "@typescript-eslint/typescript-estree";

export function parseJs(js: string) {
  const parsedJs = parse(js);
  return parsedJs;
}
