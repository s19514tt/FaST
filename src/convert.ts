import { generateJs } from "./generator/0_index";
import { parseGp2File } from "./parser/0_index";

export function convert(code: string): string {
  const [parsedBase, variables, jsCode] = parseGp2File(code);
  return generateJs(parsedBase, variables, jsCode);
}
