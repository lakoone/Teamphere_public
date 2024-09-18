export function getExtension(mimeType: string): string {
  const parts = mimeType.split('/');
  return parts.length > 1 ? parts[1] : '';
}
