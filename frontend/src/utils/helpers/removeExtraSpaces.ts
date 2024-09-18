export function removeExtraSpaces(inputText: string): string {
  const regex = /(\S)(\s{5,})(\S)/g;

  return inputText
    .trimStart()
    .trimEnd()
    .replace(regex, (_, before, spaces, after) => {
      return before + '    ' + after;
    });
}
