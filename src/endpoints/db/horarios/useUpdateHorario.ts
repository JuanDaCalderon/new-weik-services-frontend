import {doc, updateDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_HORARIOS_PATH} from '@/constants';
import {Horario, HorarioToFirestore} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useUpdateHorario() {
  const [isLoadingUpdateHorario, setIsLoadingUpdateHorario] = useState<boolean>(false);

  const updateHorario = useCallback(
    async (horarioId: string, updatedHorario: Partial<Omit<Horario, 'id'>>): Promise<void> => {
      setIsLoadingUpdateHorario(true);
      try {
        const horarioRef = doc(db, FIRESTORE_HORARIOS_PATH, horarioId);
        const updatedH: HorarioToFirestore = {
          ...updatedHorario,
          ...(updatedHorario.rangoFechas
            ? {rangoFechas: updatedHorario.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))}
            : {})
        } as HorarioToFirestore;
        await updateDoc(horarioRef, {...updatedH});
        toast.success('¡Horario actualizado correctamente!');
      } catch (error: any) {
        toast.error('Error al actualizar el horario, intenta de nuevo más tarde.');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingUpdateHorario(false);
      }
    },
    []
  );

  return {
    isLoadingUpdateHorario,
    updateHorario
  };
}
