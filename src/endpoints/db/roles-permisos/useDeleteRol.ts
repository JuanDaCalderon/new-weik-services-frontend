import {db} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {ROLES_PATH} from '@/constants';
import {Rol} from '@/types';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';

export default function useDeleteRol() {
  const [isLoadingDeleteRol, setIsLoadingDeleteRol] = useState<boolean>(false);
  const deleteRol = useCallback(async (rolId: string): Promise<void> => {
    setIsLoadingDeleteRol(true);
    try {
      const rolRef = doc(db, ROLES_PATH, rolId);
      const rolDoc = await getDoc(rolRef);
      const rolData = rolDoc.data() as Rol;
      await deleteDoc(rolRef);
      toast.success(`Se ha eliminado el rol ${rolData.rol} correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingDeleteRol(false);
    }
  }, []);
  return {
    isLoadingDeleteRol,
    deleteRol
  };
}
