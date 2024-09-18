export function getFileCategory(
  mimeType: string,
): 'image' | 'file' | 'video' | 'audio' {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else {
    return 'file';
  }
}
