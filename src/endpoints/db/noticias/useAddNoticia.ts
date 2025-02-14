import {db} from '@/firebase';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {NOTICIAS_PATH} from '@/constants';
import {Noticia, NoticiaToDb} from '@/types';

export default function useAddNoticia() {
  const [isSavingTheNoticia, setIsSavingTheNoticia] = useState<boolean>(false);

  const addNoticia = useCallback(async (noticia: Omit<Noticia, 'id'>): Promise<void> => {
    setIsSavingTheNoticia(true);
    try {
      const noticiaToBd: NoticiaToDb = {
        ...noticia,
        rangoFechas: noticia.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))
      };
      await addDoc(collection(db, NOTICIAS_PATH), noticiaToBd);
      toast.success(`Has agregado una noticia`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsSavingTheNoticia(false);
    }
  }, []);

  return {
    isSavingTheNoticia,
    addNoticia
  };
}
