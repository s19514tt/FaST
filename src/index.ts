import { ArgumentParser } from "argparse";
import { generateJs } from "./generator/0_index";
import { parseGp2File } from "./parser/0_index";
import { extractFilenameAndExtension } from "./utils/extract_filename";
import { loadFile, saveFile } from "./utils/fs";

async function main() {
  const parser = new ArgumentParser();
  parser.add_argument("filename", { type: String });
  const filepath = parser.parse_args().filename;
  const gp2TextFile = await loadFile(filepath);
  const [parsedBase, variables, jsCode] = parseGp2File(gp2TextFile);
  const js = generateJs(parsedBase, variables, jsCode);
  const [filename, ext] = extractFilenameAndExtension(filepath);
  saveFile(`${filename}.g.js`, js);
}

main();
