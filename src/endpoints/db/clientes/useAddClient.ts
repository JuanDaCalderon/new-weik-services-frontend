import {db} from '@/firebase';
import {doc, setDoc, Timestamp} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {Cliente} from '@/types';
import {FIRESTORE_CLIENTES_PATH} from '@/constants';

export default function useAddClient() {
  const [isLoadingAddClient, setIsLoadingAddClient] = useState<boolean>(false);

  const addClient = useCallback(async (cliente: Cliente): Promise<void> => {
    setIsLoadingAddClient(true);
    try {
      await setDoc(doc(db, FIRESTORE_CLIENTES_PATH, cliente.domain), {
        ...cliente,
        fechaCreacion: Timestamp.now()
      });
      toast.success(`Has agregado a ${cliente.nombre.toLowerCase()} como cliente correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingAddClient(false);
    }
  }, []);

  return {
    isLoadingAddClient,
    addClient
  };
}
