import {doc, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_VACACIONES_PATH} from '@/constants';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useApproveVacaciones() {
  const [isLoadingApproveVacaciones, setIsLoadingApproveVacaciones] = useState<boolean>(false);

  const approveVacaciones = useCallback(async (vacacionesId: string, aprobadas: boolean): Promise<void> => {
    setIsLoadingApproveVacaciones(true);
    try {
      const vacationRef = doc(db, FIRESTORE_VACACIONES_PATH, vacacionesId);
      await updateDoc(vacationRef, {aprobadas});
      toast.success(`Vacaciones ${aprobadas ? 'aprobadas' : 'denegadas'} correctamente`);
    } catch (error: any) {
      toast.error('Error al aprobar o denegar las vacaciones, intenta de nuevo más tarde.');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingApproveVacaciones(false);
    }
  }, []);

  return {
    isLoadingApproveVacaciones,
    approveVacaciones
  };
}
