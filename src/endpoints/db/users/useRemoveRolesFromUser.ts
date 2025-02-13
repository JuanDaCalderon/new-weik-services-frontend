import {db} from '@/firebase';
import {arrayRemove, doc, DocumentReference, getDoc, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {ROLES_PATH, USUARIOS_PATH} from '@/constants';
import {Employee, Rol} from '@/types';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';

export default function useRemoveRolesFromUser() {
  const [isLoadingRemoveRolesFromUser, setIsLoadingRemoveRolesFromUser] = useState<boolean>(false);
  const removeRolesFromUser = useCallback(
    async (user: Pick<Employee, 'id' | 'email'>, rol: Pick<Rol, 'id' | 'rol'>): Promise<void> => {
      setIsLoadingRemoveRolesFromUser(true);
      try {
        const userRef = doc(db, USUARIOS_PATH, user.id);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          toast.error('El usuario no existe.');
          return;
        }
        const userData = userSnap.data();
        const roles: Array<DocumentReference> = userData?.roles || [];
        if (!roles.some((roleRef) => roleRef.id === rol.id)) {
          return;
        }
        const rolRef = doc(db, ROLES_PATH, rol.id);
        await updateDoc(userRef, {
          roles: arrayRemove(rolRef)
        });
        toast.success(`Rol ${rol.rol} eliminado del usuario ${user.email}`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingRemoveRolesFromUser(false);
      }
    },
    []
  );
  return {
    isLoadingRemoveRolesFromUser,
    removeRolesFromUser
  };
}
