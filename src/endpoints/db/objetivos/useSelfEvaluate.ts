import {db} from '@/firebase';
import {doc, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {FIRESTORE_OBJETIVOS_PATH} from '@/constants';
import {ObjetivosToDb, SelfAssessment} from '@/types';

export default function useSelfEvaluate() {
  const [isSelfEvaluate, setIsSelfEvaluate] = useState<boolean>(false);

  const SelfEvaluate = useCallback(
    async (objetivoId: string, selfAssessment: Partial<SelfAssessment>): Promise<void> => {
      setIsSelfEvaluate(true);
      try {
        const objetivoToBd: Partial<ObjetivosToDb> = {
          selfAssessment: {
            stars: selfAssessment.stars || 0,
            comment: selfAssessment.comment || '',
            wasReviewed: selfAssessment.wasReviewed || false
          }
        };
        const objetivoRef = doc(db, FIRESTORE_OBJETIVOS_PATH, objetivoId);
        await updateDoc(objetivoRef, objetivoToBd);
        toast.success(`Se ha enviado la autoevaluación correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsSelfEvaluate(false);
      }
    },
    []
  );

  return {
    isSelfEvaluate,
    SelfEvaluate
  };
}
