export function ConvertNameForImg(name: string): string {
  if (!name) return '';
  const words = name.trim().split(' ');

  if (words.length === 1) {
    return words[0].charAt(0);
  }

  if (words.length === 2) {
    return words[0].charAt(0) + words[1].charAt(0);
  }

  return words
    .slice(0, 3)
    .map((word) => word.charAt(0))
    .join('');
}
