export default function convertFileSize(bytes: number): string {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;

  if (bytes < kilobyte) {
    return bytes + ' B';
  } else if (bytes < megabyte) {
    return (bytes / kilobyte).toFixed(0) + ' KB';
  } else {
    return (bytes / megabyte).toFixed(2) + ' MB';
  }
}
