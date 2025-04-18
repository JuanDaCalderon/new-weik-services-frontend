import {doc, Timestamp, arrayUnion, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {USUARIOS_PATH} from '@/constants';
import {HorarioType, HorarioTypeToFirestore} from '@/types';
import {DebugUtil, generateUuid} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useAddHorario() {
  const [isLoadingAddHorario, setIsLoadingAddHorario] = useState<boolean>(false);
  const addHorario = useCallback(async (userId: string, newHorario: HorarioType): Promise<void> => {
    setIsLoadingAddHorario(true);
    try {
      const newItem: HorarioTypeToFirestore = {
        ...newHorario,
        uuid: generateUuid(),
        rangoFechas: newHorario.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))
      };
      await updateDoc(doc(db, USUARIOS_PATH, userId), {
        horario: arrayUnion(newItem)
      });
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
