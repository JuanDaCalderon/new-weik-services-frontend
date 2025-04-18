import {db} from '@/firebase';
import {doc, Timestamp, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {EVENTOS_PATH} from '@/constants';
import {Eventos, EventosToFirestore} from '@/types';

export default function useUpdateEventos() {
  const [isUpdatingTheEvento, setIsUpdatingTheEvento] = useState<boolean>(false);

  const updateEvento = useCallback(async (eventoId: string, evento: Partial<Omit<Eventos, 'id'>>): Promise<void> => {
    setIsUpdatingTheEvento(true);
    try {
      const eventoToBd: Partial<EventosToFirestore> = {
        ...evento,
        ...(evento.rangoFechas
          ? {rangoFechas: evento.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))}
          : {})
      } as Partial<EventosToFirestore>;
      const eventoRef = doc(db, EVENTOS_PATH, eventoId);
      await updateDoc(eventoRef, eventoToBd);
      toast.success(`Se ha actualizado el evento correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsUpdatingTheEvento(false);
    }
  }, []);

  return {
    isUpdatingTheEvento,
    updateEvento
  };
}
