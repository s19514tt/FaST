export function extractJavaScriptVariableInitialValue(code: string): {
  [key: string]: string;
} {
  const matches = code.matchAll(
    /(let|const|var) ([a-zA-Z_$][a-zA-Z_$0-9]*) *= *([^;\n]*)/gm
  );
  if (matches) {
    const result: { [key: string]: string } = {};
    for (const item of matches) {
      result[item[2]] = item[3];
    }
    return result;
  } else {
    return {};
  }
}
