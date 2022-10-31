import { promises as fs } from "fs";

export async function loadFile(path: string): Promise<string> {
  return await fs.readFile(path, "utf8");
}
export async function saveFile(path: string, data: string): Promise<void> {
  return await fs.writeFile(path, data, "utf8");
}
