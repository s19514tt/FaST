import { ArgumentParser } from "argparse";
import { parseGp2File } from "./parser/0_index";
import { loadFile } from "./utils/fs";

async function main() {
  const parser = new ArgumentParser();
  parser.add_argument("filename", { type: String });
  const gp2TextFile = await loadFile(parser.parse_args().filename);
  parseGp2File(gp2TextFile);
}

main();
