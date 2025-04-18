import {db} from '@/firebase';
import {deleteDoc, doc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {EVENTOS_PATH} from '@/constants';

export default function useDeleteEventos() {
  const [isDeletingEvento, setIsDeletingEvento] = useState<boolean>(false);

  const deleteEvento = useCallback(async (eventoId: string): Promise<void> => {
    setIsDeletingEvento(true);
    try {
      const eventoRef = doc(db, EVENTOS_PATH, eventoId);
      await deleteDoc(eventoRef);
      toast.success(`Se ha eliminado el evento con éxito`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsDeletingEvento(false);
    }
  }, []);

  return {
    isDeletingEvento,
    deleteEvento
  };
}
