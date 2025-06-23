import {deleteDoc, doc} from 'firebase/firestore';
import {db} from '@/firebase';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {FIRESTORE_HORARIOS_PATH} from '@/constants';

export default function useDeleteHorario() {
  const [isLoadingDeleteHorario, setIsLoadingDeleteHorario] = useState<boolean>(false);

  const deleteHorario = useCallback(async (horarioId: string): Promise<void> => {
    setIsLoadingDeleteHorario(true);
    try {
      const horarioRef = doc(db, FIRESTORE_HORARIOS_PATH, horarioId);
      await deleteDoc(horarioRef);
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
