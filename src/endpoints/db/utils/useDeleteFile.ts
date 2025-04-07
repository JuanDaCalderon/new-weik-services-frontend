import {storage} from '@/firebase';
import {ref, deleteObject} from 'firebase/storage';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';

export default function useDeleteFile() {
  const [isLoadingDeleteFile, setIsLoadingDeleteFile] = useState<boolean>(false);

  const deleteFile = useCallback(async (fileUrl: string): Promise<void> => {
    setIsLoadingDeleteFile(true);
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingDeleteFile(false);
    }
  }, []);

  return {
    isLoadingDeleteFile,
    deleteFile
  };
}
