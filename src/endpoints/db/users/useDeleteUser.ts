import {db} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_USUARIOS_PATH} from '@/constants';
import {Employee} from '@/types';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {useDeleteFile} from '@/endpoints';

export default function useDeleteUser() {
  const [isLoadingDeleteUser, setIsLoadingDeleteUser] = useState<boolean>(false);
  const {deleteFile} = useDeleteFile();

  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      setIsLoadingDeleteUser(true);
      try {
        const userRef = doc(db, FIRESTORE_USUARIOS_PATH, userId);
        const usuarioDoc = await getDoc(userRef);
        const userData = usuarioDoc.data() as Employee;
        await deleteDoc(userRef);
        if (userData.userImage) await deleteFile(userData.userImage);
        toast.success(`Se ha eliminado el usuario ${userData.email} correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingDeleteUser(false);
      }
    },
    [deleteFile]
  );
  return {
    isLoadingDeleteUser,
    deleteUser
  };
}
