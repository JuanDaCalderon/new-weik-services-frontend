import {doc, getDoc, updateDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {USUARIOS_PATH} from '@/constants';
import {HorarioType, HorarioTypeToFirestore} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useUpdateHorario() {
  const [isLoadingUpdateHorario, setIsLoadingUpdateHorario] = useState<boolean>(false);

  const updateHorario = useCallback(
    async (userId: string, horarioUuid: string, updatedHorario: Partial<Omit<HorarioType, 'uuid'>>): Promise<void> => {
      setIsLoadingUpdateHorario(true);
      try {
        const userRef = doc(db, USUARIOS_PATH, userId);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) {
          toast.error('Usuario no encontrado');
          return;
        }
        const data = snapshot.data();
        const horarios: HorarioTypeToFirestore[] = data.horario ?? [];
        const newHorarios = horarios.map((h) => {
          if (h.uuid === horarioUuid) {
            return {
              ...h,
              ...updatedHorario,
              ...(updatedHorario.rangoFechas
                ? {rangoFechas: updatedHorario.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))}
                : {})
            };
          }
          return h;
        });
        await updateDoc(userRef, {horario: newHorarios});
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
