import {db} from '@/firebase';
import {doc, Timestamp, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {OBJETIVOS_PATH} from '@/constants';
import {Objetivos, ObjetivosToDb} from '@/types';

export default function useUpdateObjetivos() {
  const [isUpdatingTheObjetivo, setIsUpdatingTheObjetivo] = useState<boolean>(false);

  const updateObjetivo = useCallback(
    async (objetivoId: string, objetivo: Partial<Omit<Objetivos, 'id'>>): Promise<void> => {
      setIsUpdatingTheObjetivo(true);
      try {
        const objetivoToBd: Partial<ObjetivosToDb> = {
          ...(objetivo as unknown as ObjetivosToDb),
          ...(objetivo.rangoFechas
            ? {rangoFechas: (objetivo.rangoFechas || []).map((date) => Timestamp.fromDate(new Date(date)))}
            : {}),
          ...(objetivo.createdAt ? {createdAt: Timestamp.fromDate(new Date(objetivo.createdAt))} : {})
        };
        const objetivoRef = doc(db, OBJETIVOS_PATH, objetivoId);
        await updateDoc(objetivoRef, objetivoToBd);
        toast.success(`Se ha actualizado el objetivo correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsUpdatingTheObjetivo(false);
      }
    },
    []
  );

  return {
    isUpdatingTheObjetivo,
    updateObjetivo
  };
}
