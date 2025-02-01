import {FileType} from '@/components';
import {useCallback, useState} from 'react';

export default function useClientImage() {
  const [clientImage, setClientImage] = useState<FileType>();

  const handleImageFile = useCallback((file: FileType) => {
    setClientImage(file);
  }, []);

  const handleImageRemoved = useCallback(() => {
    setClientImage(undefined);
  }, []);

  return {
    clientImage,
    handleImageFile,
    handleImageRemoved
  };
}
