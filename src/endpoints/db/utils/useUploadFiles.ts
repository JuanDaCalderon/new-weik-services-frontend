import {storage} from '@/firebase';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {FileType} from '@/components';

export default function useUploadFiles() {
  const [isLoadingUploadFile, setIsLoadingUploadFile] = useState<boolean>(false);

  const uploadFile = useCallback(async (path: string, name: string, file: FileType): Promise<string> => {
    setIsLoadingUploadFile(true);
    let fileUrl: string = '';
    const storageRef = ref(storage, `${path}/${name}`);
    try {
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingUploadFile(false);
    }
    return fileUrl;
  }, []);

  return {
    isLoadingUploadFile,
    uploadFile
  };
}
