import {db} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {APPS_PATH} from '@/constants';
import useDeleteFile from '@/endpoints/db/utils/useDeleteFile';
import {Apps} from '@/types';

export default function useDeleteApp() {
  const [isDeletingApp, setIsDeletingApp] = useState<boolean>(false);
  const {deleteFile} = useDeleteFile();

  const deleteApp = useCallback(
    async (appId: string): Promise<void> => {
      setIsDeletingApp(true);
      const appRef = doc(db, APPS_PATH, appId);
      try {
        const appDoc = await getDoc(appRef);
        const appData = appDoc.data() as Apps;
        await deleteDoc(appRef);
        if (appData.icon) await deleteFile(appData.icon);
        toast.success(`Se ha eliminado el acceso directo correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsDeletingApp(false);
      }
    },
    [deleteFile]
  );

  return {
    isDeletingApp,
    deleteApp
  };
}
