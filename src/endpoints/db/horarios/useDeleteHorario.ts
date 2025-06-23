import {arrayRemove, doc, getDoc, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {FIRESTORE_USUARIOS_PATH} from '@/constants';
import {db} from '@/firebase';
import {HorarioTypeToFirestore} from '@/types';

export default function useDeleteHorario() {
  const [isLoadingDeleteHorario, setIsLoadingDeleteHorario] = useState<boolean>(false);

  const deleteHorario = useCallback(async (userId: string, uuidAEliminar: string): Promise<void> => {
    setIsLoadingDeleteHorario(true);
    try {
      const userDocRef = doc(db, FIRESTORE_USUARIOS_PATH, userId);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        toast.error('Usuario no encontrado.');
        return;
      }
      const userData = userSnapshot.data();
      const horarios: HorarioTypeToFirestore[] = userData.horario ?? [];
      const horarioAEliminar = horarios.find((h) => h.uuid === uuidAEliminar);
      if (!horarioAEliminar) {
        toast.error('Horario no encontrado');
        return;
      }
      await updateDoc(userDocRef, {
        horario: arrayRemove(horarioAEliminar)
      });
      toast.success('Horario eliminado correctamente');
    } catch (error: any) {
      toast.error('Error al eliminar el horario, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingDeleteHorario(false);
    }
  }, []);
  return {
    isLoadingDeleteHorario,
    deleteHorario
  };
}
