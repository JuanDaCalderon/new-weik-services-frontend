import {db} from '@/firebase';
import {doc, setDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {Cliente} from '@/types';
import {CLIENTES_PATH} from '@/constants';

export default function useUpdateClient() {
  const [isUpdateClient, setIsUpdateClient] = useState<boolean>(false);

  const updateClient = useCallback(
    async (id: string, newClienteData: Partial<Cliente>): Promise<void> => {
      setIsUpdateClient(true);
      try {
        await setDoc(doc(db, CLIENTES_PATH, id), {...newClienteData}, {merge: true});
        toast.success(`¡Se ha actualizado el cliente ${id} correctamente!`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsUpdateClient(false);
      }
    },
    []
  );

  return {
    isUpdateClient,
    updateClient
  };
}
