import {db} from '@/firebase';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {FIRESTORE_OBJETIVOS_PATH} from '@/constants';
import {OBJETIVO_STATUS, Objetivos, ObjetivosToDb} from '@/types';

export default function useAddObjetivos() {
  const [isSavingObjetivo, setIsSavingObjetivo] = useState<boolean>(false);

  const addObjetivo = useCallback(async (objetivo: Partial<Objetivos>): Promise<void> => {
    setIsSavingObjetivo(true);
    try {
      const objetivoToBd: ObjetivosToDb = {
        ...objetivo,
        rangoFechas: (objetivo.rangoFechas || []).map((date) => Timestamp.fromDate(new Date(date))),
        createdAt: Timestamp.fromDate(new Date()),
        status: OBJETIVO_STATUS.PENDIENTE,
        requiredSelfAssessment: objetivo.requiredSelfAssessment || false
      } as ObjetivosToDb;
      await addDoc(collection(db, FIRESTORE_OBJETIVOS_PATH), objetivoToBd);
      toast.success(`Has agregado un objetivo correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsSavingObjetivo(false);
    }
  }, []);

  return {
    isSavingObjetivo,
    addObjetivo
  };
}
