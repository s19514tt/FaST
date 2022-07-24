export function parseLanguage(str: string) {
  const strArray = str.split("\n");
  let currentLanguage = "";
  let currentCode = "";
  let result: { [key: string]: string } = {};
  for (let line of strArray) {
    if (line.startsWith("  ")) {
      currentCode += `${line}
      `;
    } else if (line.startsWith("script:")) {
      if (Object.keys(result).includes("script")) {
        throw Error("language script specified twice");
      } else if (currentLanguage != "") {
        result[currentLanguage] = currentCode;
      }
      currentCode = "";
      currentLanguage = "script";
    } else if (line.startsWith("html:")) {
      if (Object.keys(result).includes("html")) {
        throw Error("language script specified twice");
      } else if (currentLanguage != "") {
        result[currentLanguage] = currentCode;
      }
      currentCode = "";
      currentLanguage = "html";
    } else if (line.length !== 0) {
      throw Error(
        "start of line of GP2 must be 2 white spaces or language specicification"
      );
    }
    result[currentLanguage] = currentCode;
  }
  return result;
}
