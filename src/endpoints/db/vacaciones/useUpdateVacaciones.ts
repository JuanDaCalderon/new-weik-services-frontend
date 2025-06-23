import {doc, updateDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_VACACIONES_PATH} from '@/constants';
import {VacacionesToFirestore, Vacaciones} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useUpdateVacaciones() {
  const [isLoadingUpdateVacaciones, setIsLoadingUpdateVacaciones] = useState<boolean>(false);

  const updateVacaciones = useCallback(
    async (vacacionesId: string, updatedVacaciones: Partial<Omit<Vacaciones, 'id' | 'aprobadas'>>): Promise<void> => {
      setIsLoadingUpdateVacaciones(true);
      try {
        const vacacionesRef = doc(db, FIRESTORE_VACACIONES_PATH, vacacionesId);
        const updatedV: VacacionesToFirestore = {
          ...updatedVacaciones,
          ...(updatedVacaciones.rangoFechas
            ? {rangoFechas: updatedVacaciones.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))}
            : {})
        } as VacacionesToFirestore;
        await updateDoc(vacacionesRef, {...updatedV});
        toast.success('¡Vacaciones actualizadas correctamente!');
      } catch (error: any) {
        toast.error('Error al actualizar las vacaciones, intenta de nuevo más tarde.');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingUpdateVacaciones(false);
      }
    },
    []
  );

  return {
    isLoadingUpdateVacaciones,
    updateVacaciones
  };
}
