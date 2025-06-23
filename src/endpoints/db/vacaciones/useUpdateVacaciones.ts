import {doc, getDoc, updateDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_USUARIOS_PATH} from '@/constants';
import {VacacionesTypeToFirestore, VacacionesType} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useUpdateVacaciones() {
  const [isLoadingUpdateVacaciones, setIsLoadingUpdateVacaciones] = useState<boolean>(false);

  const updateVacaciones = useCallback(
    async (
      userId: string,
      vacacionesUuid: string,
      updatedVacaciones: Partial<Omit<VacacionesType, 'uuid' | 'aprobadas'>>
    ): Promise<void> => {
      setIsLoadingUpdateVacaciones(true);
      try {
        const userRef = doc(db, FIRESTORE_USUARIOS_PATH, userId);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) {
          toast.error('Usuario no encontrado');
          return;
        }
        const data = snapshot.data();
        const vacaciones: VacacionesTypeToFirestore[] = data.vacaciones ?? [];
        const newVacaciones = vacaciones.map((v) => {
          if (v.uuid === vacacionesUuid) {
            return {
              ...v,
              ...updatedVacaciones,
              ...(updatedVacaciones.rangoFechas
                ? {rangoFechas: updatedVacaciones.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))}
                : {})
            };
          }
          return v;
        });
        await updateDoc(userRef, {vacaciones: newVacaciones});
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
