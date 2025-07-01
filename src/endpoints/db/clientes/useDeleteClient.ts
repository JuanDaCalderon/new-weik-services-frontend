import {db} from '@/firebase';
import {collection, deleteDoc, doc, getDoc, getDocs} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import {FIRESTORE_CLIENTES_PATH} from '@/constants';
import {Cliente} from '@/types';
import toast from 'react-hot-toast';
import {DebugUtil} from '@/utils';
import {useDeleteFile} from '@/endpoints';

export default function useDeleteClient() {
  const [isLoadingDeleteCliente, setIsLoadingDeleteCliente] = useState<boolean>(false);
  const {deleteFile} = useDeleteFile();

  const deleteSubcollectionDocs = useCallback(async (clienteId: string, subcollectionName: string) => {
    const subcollectionRef = collection(db, FIRESTORE_CLIENTES_PATH, clienteId, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }, []);

  const deleteCliente = useCallback(
    async (clienteId: string): Promise<void> => {
      setIsLoadingDeleteCliente(true);
      const clienteRef = doc(db, FIRESTORE_CLIENTES_PATH, clienteId);
      try {
        const clienteDoc = await getDoc(clienteRef);
        const clienteData = clienteDoc.data() as Cliente;
        if (!clienteDoc.exists()) {
          toast.error('El cliente no existe o ya fue eliminado.');
          return;
        }
        const subCollections = (clienteData.tiposRegistros ?? []).map(({tipo}) => tipo.toUpperCase());
        const deletePromises = subCollections.map((subcollection) => deleteSubcollectionDocs(clienteId, subcollection));
        await Promise.all(deletePromises);

        if (clienteData.logo) await deleteFile(clienteData.logo);
        if (clienteData.documento) await deleteFile(clienteData.documento);

        await deleteDoc(clienteRef);

        toast.success(`Se ha eliminado el cliente ${clienteData.nombre} correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingDeleteCliente(false);
      }
    },
    [deleteFile, deleteSubcollectionDocs]
  );

  return {
    isLoadingDeleteCliente,
    deleteCliente
  };
}
