import {db} from '@/firebase';
import {doc, setDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {Cliente} from '@/types';
import {FIRESTORE_CLIENTES_PATH} from '@/constants';

export default function useUpdateClient() {
  const [isUpdateClient, setIsUpdateClient] = useState<boolean>(false);

  const updateClient = useCallback(async (id: string, newClienteData: Partial<Cliente>): Promise<void> => {
    if (Object.keys(newClienteData).length === 0) {
      toast.error('No se proporcionaron datos para actualizar.');
      return;
    }
    setIsUpdateClient(true);
    try {
      await setDoc(doc(db, FIRESTORE_CLIENTES_PATH, id), {...newClienteData}, {merge: true});
      toast.success(`¡Se ha actualizado el cliente ${id} correctamente!`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsUpdateClient(false);
    }
  }, []);

  return {
    isUpdateClient,
    updateClient
  };
}
