import {db} from '@/firebase';
import {doc, Timestamp, updateDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {OBJETIVOS_PATH} from '@/constants';
import {Evaluation, ObjetivosToDb} from '@/types';

export default function useEvaluateObjetivos() {
  const [isEvaluateTheObjetivo, setIsEvaluateTheObjetivo] = useState<boolean>(false);

  const evaluateObjetivo = useCallback(async (objetivoId: string, evaluation: Partial<Evaluation>): Promise<void> => {
    setIsEvaluateTheObjetivo(true);
    try {
      const objetivoToBd: Partial<ObjetivosToDb> = {
        evaluation: {
          stars: evaluation.stars || 0,
          feedback: evaluation.feedback || '',
          wasReviewed: evaluation.wasReviewed || false,
          evaluatedAt: Timestamp.fromDate(new Date())
        }
      };
      const objetivoRef = doc(db, OBJETIVOS_PATH, objetivoId);
      await updateDoc(objetivoRef, objetivoToBd);
      toast.success(`Se ha evaluado el objetivo correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsEvaluateTheObjetivo(false);
    }
  }, []);

  return {
    isEvaluateTheObjetivo,
    evaluateObjetivo
  };
}
