import {db} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {FIRESTORE_NOTICIAS_PATH} from '@/constants';
import useDeleteFile from '@/endpoints/db/utils/useDeleteFile';
import {Noticia} from '@/types';

export default function useDeleteNoticia() {
  const [isDeletingTheNoticia, setIsDeletingTheNoticia] = useState<boolean>(false);
  const {deleteFile} = useDeleteFile();

  const deleteNoticia = useCallback(
    async (noticiaId: string): Promise<void> => {
      setIsDeletingTheNoticia(true);
      const noticiaRef = doc(db, FIRESTORE_NOTICIAS_PATH, noticiaId);
      try {
        const noticiaDoc = await getDoc(noticiaRef);
        const noticiaData = noticiaDoc.data() as Noticia;
        await deleteDoc(noticiaRef);
        if (noticiaData.image) await deleteFile(noticiaData.image);
        toast.success(`Se ha eliminado la noticia correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsDeletingTheNoticia(false);
      }
    },
    [deleteFile]
  );

  return {
    isDeletingTheNoticia,
    deleteNoticia
  };
}
