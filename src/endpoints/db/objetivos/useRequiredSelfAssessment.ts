import {db} from '@/firebase';
import {doc, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {OBJETIVOS_PATH} from '@/constants';
import {ObjetivosToDb} from '@/types';

export default function useRequiredSelfAssessment() {
  const [isRequiredSelfAssessment, setIsRequiredSelfAssessment] = useState<boolean>(false);

  const requiredSelfAssessment = useCallback(async (objetivoId: string): Promise<void> => {
    setIsRequiredSelfAssessment(true);
    try {
      const objetivoToBd: Partial<ObjetivosToDb> = {
        requiredSelfAssessment: true
      };
      const objetivoRef = doc(db, OBJETIVOS_PATH, objetivoId);
      await updateDoc(objetivoRef, objetivoToBd);
      toast.success(`Se ha solicitado la autoevaluación correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsRequiredSelfAssessment(false);
    }
  }, []);

  return {
    isRequiredSelfAssessment,
    requiredSelfAssessment
  };
}
