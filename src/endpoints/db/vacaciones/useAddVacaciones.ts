import {Timestamp, addDoc, collection} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_VACACIONES_PATH} from '@/constants';
import {Vacaciones, VacacionesToFirestore} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

export default function useAddVacaciones() {
  const [isLoadingAddVacaciones, setIsLoadingAddVacaciones] = useState<boolean>(false);
  const {id} = useAppSelector(selectUser);

  const addVacaciones = useCallback(
    async (newVacaciones: Vacaciones): Promise<void> => {
      setIsLoadingAddVacaciones(true);
      try {
        const vacacionesToDb: VacacionesToFirestore = {
          ...newVacaciones,
          userId: id,
          rangoFechas: newVacaciones.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))
        };
        await addDoc(collection(db, FIRESTORE_VACACIONES_PATH), vacacionesToDb);
        toast.success('Solicitud de vacaciones creada con éxito!');
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingAddVacaciones(false);
      }
    },
    [id]
  );

  return {
    isLoadingAddVacaciones,
    addVacaciones
  };
}
