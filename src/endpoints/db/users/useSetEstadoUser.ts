import {useCallback} from 'react';
import {db} from '@/firebase';
import {doc, setDoc} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {ESTADOS, USUARIOS_PATH} from '@/constants';
import {DebugUtil} from '@/utils';

const useSetEstadoUser = () => {
  const setOnlineUser = useCallback(async (id: string): Promise<void> => {
    try {
      await setDoc(doc(db, USUARIOS_PATH, id), {estado: ESTADOS.online}, {merge: true});
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    }
  }, []);

  const setOfflineUser = useCallback(async (id: string): Promise<void> => {
    try {
      await setDoc(doc(db, USUARIOS_PATH, id), {estado: ESTADOS.offline}, {merge: true});
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    }
  }, []);

  const setInactiveUser = useCallback(async (id: string): Promise<void> => {
    try {
      await setDoc(doc(db, USUARIOS_PATH, id), {estado: ESTADOS.inactivo}, {merge: true});
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    }
  }, []);

  return {
    setOnlineUser,
    setOfflineUser,
    setInactiveUser
  };
};

export default useSetEstadoUser;
