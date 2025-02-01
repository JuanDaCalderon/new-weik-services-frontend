import {db} from '@/firebase';
import {deleteDoc, doc, getDoc} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {CLIENTES_PATH} from '@/constants';
import {Cliente} from '@/types';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {useDeleteImage} from '@/endpoints';

export default function useDeleteClient() {
  const [isLoadingDeleteCliente, setIsLoadingDeleteCliente] = useState<boolean>(false);
  const {deleteImage} = useDeleteImage();

  const deleteCliente = useCallback(
    async (clienteId: string): Promise<void> => {
      setIsLoadingDeleteCliente(true);
      const clienteRef = doc(db, CLIENTES_PATH, clienteId);
      try {
        const clienteDoc = await getDoc(clienteRef);
        const clienteData = clienteDoc.data() as Cliente;
        await deleteDoc(clienteRef);
        if (clienteData.logo) await deleteImage(clienteData.logo);
        toast.success(`Se ha eliminado el cliente ${clienteData.nombre} correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingDeleteCliente(false);
      }
    },
    [deleteImage]
  );
  return {
    isLoadingDeleteCliente,
    deleteCliente
  };
}
