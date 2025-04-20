import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {USUARIOS_PATH} from '@/constants';
import {VacacionesTypeToFirestore} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useApproveVacaciones() {
  const [isLoadingApproveVacaciones, setIsLoadingApproveVacaciones] = useState<boolean>(false);

  const approveVacaciones = useCallback(
    async (userId: string, vacacionesUuid: string, aprobadas: boolean): Promise<void> => {
      setIsLoadingApproveVacaciones(true);
      try {
        const userRef = doc(db, USUARIOS_PATH, userId);
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
              aprobadas: aprobadas
            };
          }
          return v;
        });
        await updateDoc(userRef, {vacaciones: newVacaciones});
        toast.success(`Vacaciones ${aprobadas ? 'aprobadas' : 'denegadas'} correctamente`);
      } catch (error: any) {
        toast.error('Error al aprobar o denegar las vacaciones, intenta de nuevo más tarde.');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingApproveVacaciones(false);
      }
    },
    []
  );

  return {
    isLoadingApproveVacaciones,
    approveVacaciones
  };
}
