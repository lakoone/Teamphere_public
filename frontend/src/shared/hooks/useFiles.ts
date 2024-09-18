import { useState, useEffect } from 'react';
import { fileDTO } from '@/entities/file/types';

type MessageFiles = {
  imageFiles: fileDTO[];
  documentFiles: fileDTO[];
};

export const useMessageFiles = (files: fileDTO[]): MessageFiles => {
  const [imageFiles, setImageFiles] = useState<fileDTO[]>([]);
  const [documentFiles, setDocumentFiles] = useState<fileDTO[]>([]);

  useEffect(() => {
    const imageList: fileDTO[] = [];
    const documentList: fileDTO[] = [];

    files.forEach((file) => {
      file.type.startsWith('image/')
        ? imageList.push(file)
        : documentList.push(file);
    });

    setImageFiles(imageList);
    setDocumentFiles(documentList);
  }, [files]);

  return { imageFiles, documentFiles };
};
