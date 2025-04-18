import {doc, setDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {USUARIOS_PATH} from '@/constants';
import {HorarioType, PartialEmployee} from '@/types';
import {DebugUtil} from '@/utils';
import {db} from '@/firebase';
import toast from 'react-hot-toast';

export default function useAddHorario() {
  const [isLoadingAddHorario, setIsLoadingAddHorario] = useState<boolean>(false);
  const addHorario = useCallback(
    async (userId: string, currentUseHorarios: HorarioType[], newHorario: HorarioType): Promise<void> => {
      setIsLoadingAddHorario(true);
      try {
        const Employee: PartialEmployee = {
          horario: [
            ...(currentUseHorarios ?? []),
            {
              ...newHorario,
              rangoFechas: newHorario.rangoFechas.map((date) => Timestamp.fromDate(new Date(date)))
            }
          ]
        } as PartialEmployee;
        await setDoc(doc(db, USUARIOS_PATH, userId), Employee, {merge: true});
        toast.success('¡Horario agregado correctamente!');
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingAddHorario(false);
      }
    },
    []
  );
  return {
    isLoadingAddHorario,
    addHorario
  };
}
