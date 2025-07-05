import {useCallback, useState} from 'react';
import {db} from '@/firebase';
import {DebugUtil} from '@/utils';
import {doc, Timestamp, updateDoc} from 'firebase/firestore';
import {FIRESTORE_CLIENTES_PATH, TOAST_DURATION_2X} from '@/constants';
import toast from 'react-hot-toast';
import {RegistrosToDb} from '@/types';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const useUpdateRegistros = () => {
  const [isUpdatingRegistro, setIsUpdatingRegistro] = useState<boolean>(false);
  const {id} = useAppSelector(selectUser);

  const updateRegistroPerClienteType = useCallback(
    async (
      cliente: string,
      tipo: string,
      registroId: string,
      newRegistroValue: Partial<RegistrosToDb>
    ): Promise<void> => {
      setIsUpdatingRegistro(true);
      try {
        const registroRef = doc(db, `${FIRESTORE_CLIENTES_PATH}/${cliente}/${tipo}`, registroId);
        await updateDoc(registroRef, {
          ...newRegistroValue,
          updatedBy: id,
          updatedAt: Timestamp.now()
        });
        const updatedFields = Object.keys(newRegistroValue);
        const fieldUpdated: string = updatedFields.length > 0 ? updatedFields[0] : 'registro';
        toast.success(`Se ha actualizado el ${fieldUpdated} correctamente`, {
          duration: TOAST_DURATION_2X
        });
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsUpdatingRegistro(false);
      }
    },
    [id]
  );

  return {
    updateRegistroPerClienteType,
    isUpdatingRegistro
  };
};

export default useUpdateRegistros;
