import {db} from '@/firebase';
import {addDoc, collection} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {FIRESTORE_APPS_PATH} from '@/constants';
import {Apps, AppsToDb} from '@/types';

export default function useAddApp() {
  const [isSavingApp, setIsSavingApp] = useState<boolean>(false);

  const addApp = useCallback(async (app: Omit<Apps, 'id'>): Promise<void> => {
    setIsSavingApp(true);
    try {
      const appToBd: AppsToDb = {...app};
      await addDoc(collection(db, FIRESTORE_APPS_PATH), appToBd);
      toast.success(`Has agregado un acceso directo`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsSavingApp(false);
    }
  }, []);

  return {
    isSavingApp,
    addApp
  };
}
