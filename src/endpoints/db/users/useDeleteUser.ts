import {db} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {USUARIOS_PATH} from '@/constants';
import {Employee} from '@/types';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {useDeleteImage} from '@/endpoints';

export default function useDeleteUser() {
  const [isLoadingDeleteUser, setIsLoadingDeleteUser] = useState<boolean>(false);
  const {deleteImage} = useDeleteImage();

  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      setIsLoadingDeleteUser(true);
      const userRef = doc(db, USUARIOS_PATH, userId);
      try {
        const usuarioDoc = await getDoc(userRef);
        const userData = usuarioDoc.data() as Employee;
        await deleteDoc(userRef);
        if (userData.userImage) await deleteImage(userData.userImage);
        toast.success(`Se ha eliminado el usuario ${userData.email} correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingDeleteUser(false);
      }
    },
    [deleteImage]
  );
  return {
    isLoadingDeleteUser,
    deleteUser
  };
}
