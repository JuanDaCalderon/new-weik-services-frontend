import {db} from '@/firebase';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {Employee} from '@/types';
import {USUARIOS_PATH} from '@/constants';

export default function useAddUser() {
  const [isLoadingAddUser, setIsLoadingAddUser] = useState<boolean>(false);

  const addUser = useCallback(async (user: Employee): Promise<void> => {
    setIsLoadingAddUser(true);
    try {
      await addDoc(collection(db, USUARIOS_PATH), {
        ...user,
        fechaNacimiento: Timestamp.now(),
        fechaCreacion: Timestamp.now()
      });
      toast.success(`Has agregado ${user.email.toLowerCase()} como usuario correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingAddUser(false);
    }
  }, []);

  return {
    isLoadingAddUser,
    addUser
  };
}
