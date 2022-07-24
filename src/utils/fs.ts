import { promises as fs } from "fs";

export async function loadFile(path: string): Promise<string> {
  return await fs.readFile(path, "utf8");
}
