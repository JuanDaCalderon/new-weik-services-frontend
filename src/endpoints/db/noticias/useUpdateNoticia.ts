import {db} from '@/firebase';
import {doc, setDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {NOTICIAS_PATH} from '@/constants';
import {Noticia, NoticiaToDb} from '@/types';

export default function useUpdateNoticia() {
  const [isUpdatingTheNoticia, setIsUpdatingTheNoticia] = useState<boolean>(false);

  const updateNoticia = useCallback(
    async (noticiaId: string, noticia: Partial<Omit<Noticia, 'id' | 'image'>>): Promise<void> => {
      setIsUpdatingTheNoticia(true);
      try {
        const noticiaToBd: Partial<NoticiaToDb> = {
          ...noticia,
          ...(noticia.rangoFechas
            ? {rangoFechas: noticia.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))}
            : {})
        } as Partial<NoticiaToDb>;
        await setDoc(doc(db, NOTICIAS_PATH, noticiaId), noticiaToBd, {merge: true});
        toast.success(`Se ha actualizado la noticia correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsUpdatingTheNoticia(false);
      }
    },
    []
  );

  return {
    isUpdatingTheNoticia,
    updateNoticia
  };
}
