import {db} from '@/firebase';
import {deleteDoc, doc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {CLIENTES_PATH} from '@/constants';

export default function useRemoveRegistros() {
  const [isDeletingRegistro, setIsDeletingRegistro] = useState<boolean>(false);

  const deleteRegistro = useCallback(async (cliente: string, tipo: string, registroIds: string[]): Promise<void> => {
    setIsDeletingRegistro(true);
    try {
      for (const registroId of registroIds) {
        const registroRef = doc(db, `${CLIENTES_PATH}/${cliente}/${tipo}`, registroId);
        await deleteDoc(registroRef);
      }
      toast.success(`Has eliminado los registros de ${cliente} - ${tipo} correctamente.`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsDeletingRegistro(false);
    }
  }, []);

  return {
    isDeletingRegistro,
    deleteRegistro
  };
}
