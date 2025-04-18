import {db} from '@/firebase';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {EVENTOS_PATH} from '@/constants';
import {Eventos, EventosToFirestore} from '@/types';

export default function useAddEventos() {
  const [isSavingEvento, setIsSavingEvento] = useState<boolean>(false);

  const addEvento = useCallback(async (evento: Eventos): Promise<void> => {
    setIsSavingEvento(true);
    try {
      const eventoToBd: EventosToFirestore = {
        ...evento,
        rangoFechas: evento.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))
      };
      await addDoc(collection(db, EVENTOS_PATH), eventoToBd);
      toast.success(`Has agregado un evento correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsSavingEvento(false);
    }
  }, []);

  return {
    isSavingEvento,
    addEvento
  };
}
