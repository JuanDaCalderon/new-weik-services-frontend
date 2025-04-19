import {doc, Timestamp, arrayUnion, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {USUARIOS_PATH} from '@/constants';
import {VacacionesType, VacacionesTypeToFirestore} from '@/types';
import {DebugUtil, generateUuid} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

export default function useAddVacaciones() {
  const [isLoadingAddVacaciones, setIsLoadingAddVacaciones] = useState<boolean>(false);
  const {id} = useAppSelector(selectUser);

  const addVacaciones = useCallback(
    async (newVacaciones: VacacionesType): Promise<void> => {
      setIsLoadingAddVacaciones(true);
      try {
        const newItem: VacacionesTypeToFirestore = {
          ...newVacaciones,
          uuid: generateUuid(),
          rangoFechas: newVacaciones.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))
        };
        await updateDoc(doc(db, USUARIOS_PATH, id), {
          vacaciones: arrayUnion(newItem)
        });
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
