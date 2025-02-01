import {db, storage} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {deleteObject, ref} from 'firebase/storage';
import {useCallback, useState} from 'react';
import {CLIENTES_PATH} from '@/constants';
import {Cliente} from '@/types';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';

export default function useDeleteClient() {
  const [isLoadingDeleteCliente, setIsLoadingDeleteCliente] = useState<boolean>(false);

  const deleteCliente = useCallback(async (clienteId: string): Promise<void> => {
    setIsLoadingDeleteCliente(true);
    const clienteRef = doc(db, CLIENTES_PATH, clienteId);
    try {
      const clienteDoc = await getDoc(clienteRef);
      const clienteData = clienteDoc.data() as Cliente;
      await deleteDoc(clienteRef);
      if (clienteData.logo) {
        const imageRef = ref(storage, clienteData.logo);
        await deleteObject(imageRef);
      }
      toast.success(`Se ha eliminado el cliente ${clienteData.nombre} correctamente`);
    } catch (error: any) {
      toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    } finally {
      setIsLoadingDeleteCliente(false);
    }
  }, []);
  return {
    isLoadingDeleteCliente,
    deleteCliente
  };
}
