import {useCallback, useState} from 'react';
import {db} from '@/firebase';
import {DebugUtil} from '@/utils';
import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {FIRESTORE_CLIENTES_PATH} from '@/constants';
import toast from 'react-hot-toast';
import {RegistrosToDb, RegistrosToBecreated} from '@/types';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const useAddRegistros = () => {
  const [isSavingRegistro, setIsSavingRegistro] = useState<boolean>(false);
  const {id} = useAppSelector(selectUser);

  const addRegistroPerClienteType = useCallback(
    async (cliente: string, tipo: string, registro: RegistrosToBecreated): Promise<void> => {
      setIsSavingRegistro(true);
      try {
        const registroToAdd: RegistrosToDb = {
          ...registro,
          createdBy: id,
          updatedBy: id,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          requestAt: Timestamp.fromDate(registro.requestAt || new Date()),
          deliverAt: Timestamp.fromDate(registro.deliverAt || new Date()),
          comentarios: registro.comentarios.map((comment) => ({
            ...comment,
            createdAt: Timestamp.fromDate(comment.createdAt || new Date()),
            createdBy: comment.createdBy || id
          }))
        };
        await addDoc(collection(db, `${FIRESTORE_CLIENTES_PATH}/${cliente}/${tipo}`), registroToAdd);
        toast.success(`Has agregado un ${registroToAdd.isSubRegistro ? 'subregistro' : 'registro'} correctamente`);
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsSavingRegistro(false);
      }
    },
    [id]
  );

  return {
    addRegistroPerClienteType,
    isSavingRegistro
  };
};

export default useAddRegistros;
