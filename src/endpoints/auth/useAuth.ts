import {auth} from '@/firebase';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores/user';
import {logOutUser} from '@/store/slices/user';
import {User} from '@/types';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {useCallback} from 'react';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';

const useAuth = () => {
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  const dispatch = useDispatch();

  const authLogIn = useCallback(
    async ({email, password}: {email: string; password: string}): Promise<User | null> => {
      let user: User | null = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token: string = await userCredential.user.getIdToken(true);
        user = {
          token: token,
          email: userCredential.user.email,
          uid: userCredential.user.uid
        } as User;
        toast.success(`Has iniciado sesión correctamente como ${user?.email}`);
      } catch (error: any) {
        let code: string = '';
        error instanceof Error && (code = error.message);
        console.error('🚀 ~ authLogOut ~ error:', {message: error.toString(), type: 'error'});
        if (code === 'Firebase: Error (auth/invalid-email).') {
          toast.error('¡Ups parece que los datos de ingreso no son correctos, intenta de nuevo!');
        } else if (code === 'Firebase: Error (auth/wrong-password).') {
          toast.error('¡Ups parece que la contraseña ingresada es incorrecta!');
        } else if (code === 'Firebase: Error (auth/user-not-found).') {
          toast.error('¡Ups parece que no tenemos ningún usuario registrado con este email!');
        } else {
          toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        }
      }
      return user;
    },
    []
  );

  const authLogOut = useCallback(async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
        console.info('se hizo el logout en firebase');
      }
      if (isLoggedIn) {
        dispatch(logOutUser());
        toast.success('¡Sesión cerrada exitosamente!');
      }
    } catch (error: any) {
      console.error('🚀 ~ authLogOut ~ error:', {message: error.toString(), type: 'error'});
      toast.error('¡Ups parece que ha ocurrido un error, intenta de nuevo más tarde!');
    }
  }, [dispatch, isLoggedIn]);

  return {authLogIn, authLogOut};
};

export default useAuth;
