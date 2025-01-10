import {auth} from '@/firebase';
import {DebugUtil} from '@/utils';
import {updatePassword} from 'firebase/auth';
import {useCallback} from 'react';
import toast from 'react-hot-toast';

const useChangePassword = () => {
  const setChangePassword = useCallback(async (newPassword: string) => {
    const thisUser = auth.currentUser;
    if (thisUser) {
      try {
        await updatePassword(thisUser, newPassword);
        toast.success('¡Contraseña actualizada correctamente!');
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      }
    }
  }, []);

  return {setChangePassword};
};

export default useChangePassword;
