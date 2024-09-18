import { getFileCategory } from '@/utils/helpers/getFileCategory';

export function showFileCategory(type: string) {
  const category = getFileCategory(type);
  switch (category) {
    case 'file':
      return;
    case 'audio':
    case 'image':
    case 'video':
  }
}
