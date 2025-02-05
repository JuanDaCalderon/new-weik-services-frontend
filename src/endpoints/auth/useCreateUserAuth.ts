import {auth} from '@/firebase';
import {useCallback, useState} from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';

export default function useCreateUserAuth() {
  const [isLoadingCreateAuthUser, setIsLoadingCreateAuthUser] = useState<boolean>(false);

  const createAuthUser = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoadingCreateAuthUser(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingCreateAuthUser(false);
    }
  }, []);

  return {
    isLoadingCreateAuthUser,
    createAuthUser
  };
}
