import {storage} from '@/firebase';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {FileType} from '@/components';

export default function useUploadImage() {
  const [isLoadingUploadImage, setIsLoadingUploadImage] = useState<boolean>(false);

  const uploadImage = useCallback(
    async (path: string, name: string, image: FileType): Promise<string> => {
      setIsLoadingUploadImage(true);
      let imageUrl: string = '';
      const storageRef = ref(storage, `${path}/${name}`);
      try {
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingUploadImage(false);
      }
      return imageUrl;
    },
    []
  );

  return {
    isLoadingUploadImage,
    uploadImage
  };
}
