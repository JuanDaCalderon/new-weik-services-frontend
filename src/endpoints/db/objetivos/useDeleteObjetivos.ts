import {db} from '@/firebase';
import {deleteDoc, doc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {FIRESTORE_OBJETIVOS_PATH} from '@/constants';

export default function useDeleteObjetivos() {
  const [isDeletingObjetivo, setIsDeletingObjetivo] = useState<boolean>(false);

  const deleteObjetivo = useCallback(async (objetivoId: string): Promise<void> => {
    setIsDeletingObjetivo(true);
    try {
      const objetivoRef = doc(db, FIRESTORE_OBJETIVOS_PATH, objetivoId);
      await deleteDoc(objetivoRef);
      toast.success(`Se ha eliminado el objetivo con éxito`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsDeletingObjetivo(false);
    }
  }, []);

  return {
    isDeletingObjetivo,
    deleteObjetivo
  };
}
