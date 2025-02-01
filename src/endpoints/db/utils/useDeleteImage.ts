import {storage} from '@/firebase';
import {ref, deleteObject} from 'firebase/storage';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';

export default function useDeleteImage() {
  const [isLoadingDeleteImage, setIsLoadingDeleteImage] = useState<boolean>(false);

  const deleteImage = useCallback(async (imageUrl: string): Promise<void> => {
    setIsLoadingDeleteImage(true);
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingDeleteImage(false);
    }
  }, []);

  return {
    isLoadingDeleteImage,
    deleteImage
  };
}
