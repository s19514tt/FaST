export function extractFilenameAndExtension(path: string): [string, string] {
  const filename = path.split("/").pop() ?? path;
  const extension = filename.split(".").pop() ?? "";
  return [filename, extension];
}
