import {auth} from '@/firebase';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector, selectUser} from '@/store/selectores/user';
import {logOutUser} from '@/store/slices/user';
import {User} from '@/types';
import {sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {useCallback} from 'react';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import {DebugUtil} from '@/utils';
import {clearPermisos, clearRoles} from '@/store/slices/roles-permisos';
import {clearClientes} from '@/store/slices/clientes';
import {useGetUsers, useSetEstadoUser} from '@/endpoints';

const useAuth = () => {
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  const {id} = useAppSelector(selectUser);
  const {getLoggedInUser} = useGetUsers();
  const {setOnlineUser, setOfflineUser} = useSetEstadoUser();
  const dispatch = useDispatch();

  const authLogIn = useCallback(
    async ({email, password}: {email: string; password: string}): Promise<User | null> => {
      let user: User | null = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token: string = await userCredential.user.getIdToken(true);
        const userFromDb = await getLoggedInUser(userCredential.user.email ?? '');
        if (userFromDb) {
          await setOnlineUser(userFromDb.id);
          user = {
            ...userFromDb,
            token: token,
            email: userCredential.user.email,
            uid: userCredential.user.uid
          } as User;
          DebugUtil.logSuccess('Has iniciado sesión correctamente', user?.email);
        }
      } catch (error: any) {
        let code: string = '';
        error instanceof Error && (code = error.message);
        DebugUtil.logError(code, error);
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
    [getLoggedInUser, setOnlineUser]
  );

  const authLogOut = useCallback(async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
        DebugUtil.logSuccess('se hizo el logout en firebase', auth);
      }
      if (id) await setOfflineUser(id);
      if (isLoggedIn) {
        dispatch(logOutUser());
        dispatch(clearRoles());
        dispatch(clearPermisos());
        dispatch(clearClientes());
        toast.success('¡Sesión cerrada exitosamente!');
        DebugUtil.logSuccess('¡Sesión cerrada exitosamente!');
      }
    } catch (error: any) {
      DebugUtil.logError(
        '¡Ups parece que ha ocurrido un error, intenta de nuevo más tarde!',
        error
      );
      toast.error('¡Ups parece que ha ocurrido un error, intenta de nuevo más tarde!');
    }
  }, [dispatch, id, isLoggedIn, setOfflineUser]);

  const authRecoverPassword = useCallback(
    async ({email}: {email: string}): Promise<string | null> => {
      let returnEmail: string | null = null;
      try {
        await sendPasswordResetEmail(auth, email);
        returnEmail = email;
        DebugUtil.logSuccess('La solicitud ha sido creada correctamente', email);
      } catch (error: any) {
        let code: string = '';
        error instanceof Error && (code = error.message);
        DebugUtil.logError(code, error);
        if (code === 'Firebase: Error (auth/user-not-found).')
          toast.error('¡Ups parece que no tenemos ningún usuario registrado con este email!');
        else toast.error('¡Ups parece que ha ocurrido un error, intenta de nuevo más tarde!');
      }
      return returnEmail;
    },
    []
  );

  return {authLogIn, authLogOut, authRecoverPassword};
};

export default useAuth;
