import {useCallback, useState} from 'react';
import {db} from '@/firebase';
import {doc, setDoc} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {ESTADOS, USUARIOS_PATH} from '@/constants';
import {DebugUtil} from '@/utils';

const useSetEstadoUser = () => {
  const [isLoadingInactiveUser, setIsLoadingInactiveUser] = useState<boolean>(false);
  const [isLoadingOfflineUser, setIsLoadingOfflineUser] = useState<boolean>(false);

  const setOnlineUser = useCallback(async (id: string): Promise<void> => {
    try {
      await setDoc(doc(db, USUARIOS_PATH, id), {estado: ESTADOS.online}, {merge: true});
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    }
  }, []);

  const setOfflineUser = useCallback(async (id: string): Promise<void> => {
    setIsLoadingOfflineUser(true);
    try {
      await setDoc(doc(db, USUARIOS_PATH, id), {estado: ESTADOS.offline}, {merge: true});
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingOfflineUser(true);
    }
  }, []);

  const setInactiveUser = useCallback(async (id: string): Promise<void> => {
    setIsLoadingInactiveUser(true);
    try {
      await setDoc(doc(db, USUARIOS_PATH, id), {estado: ESTADOS.inactivo}, {merge: true});
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingInactiveUser(false);
    }
  }, []);

  return {
    isLoadingInactiveUser,
    isLoadingOfflineUser,
    setOnlineUser,
    setOfflineUser,
    setInactiveUser
  };
};

export default useSetEstadoUser;
