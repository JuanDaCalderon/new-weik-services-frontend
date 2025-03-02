import {db} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {APPS_PATH} from '@/constants';
import useDeleteImage from '@/endpoints/db/utils/useDeleteImage';
import {Apps} from '@/types';

export default function useDeleteApp() {
  const [isDeletingApp, setIsDeletingApp] = useState<boolean>(false);
  const {deleteImage} = useDeleteImage();

  const deleteApp = useCallback(
    async (appId: string): Promise<void> => {
      setIsDeletingApp(true);
      const appRef = doc(db, APPS_PATH, appId);
      try {
        const appDoc = await getDoc(appRef);
        const appData = appDoc.data() as Apps;
        await deleteDoc(appRef);
        if (appData.icon) await deleteImage(appData.icon);
        toast.success(`Se ha eliminado el acceso directo correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsDeletingApp(false);
      }
    },
    [deleteImage]
  );

  return {
    isDeletingApp,
    deleteApp
  };
}
