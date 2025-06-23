import {Timestamp, addDoc, collection} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_HORARIOS_PATH} from '@/constants';
import {Horario, HorarioToFirestore} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useAddHorario() {
  const [isLoadingAddHorario, setIsLoadingAddHorario] = useState<boolean>(false);

  const addHorario = useCallback(async (newHorario: Horario, userId?: string): Promise<void> => {
    setIsLoadingAddHorario(true);
    try {
      const newH: HorarioToFirestore = {
        ...newHorario,
        ...(userId ? {userId} : {}),
        rangoFechas: newHorario.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))
      };
      await addDoc(collection(db, FIRESTORE_HORARIOS_PATH), newH);
      toast.success('¡Horario agregado correctamente!');
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingAddHorario(false);
    }
  }, []);
  return {
    isLoadingAddHorario,
    addHorario
  };
}
