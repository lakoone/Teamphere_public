import { fileDTO } from '@/entities/file/types';

export const downloadFile = async (file: fileDTO) => {
  try {
    const response = await fetch(file.url);
    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();
  } catch (error) {
    console.error('Error downloading the file:', error);
  }
};
