import {USUARIOS_PATH} from '@/constants';
import {db} from '@/firebase';
import {updateDataUser} from '@/store/slices/user';
import {PartialEmployee} from '@/types';
import {DebugUtil} from '@/utils';
import {doc, setDoc, Timestamp} from 'firebase/firestore';
import {useCallback} from 'react';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';

const useUpdateUser = () => {
  const dispatch = useDispatch();

  const updateUserData = useCallback(
    async (updatedData: PartialEmployee, id: string): Promise<void> => {
      const dataToUpdate = {
        ...updatedData,
        ...(updatedData.fechaNacimiento && {
          fechaNacimiento: Timestamp.fromDate(new Date(updatedData.fechaNacimiento))
        }),
        ...(updatedData.apellidos && {
          apellidos: updatedData.apellidos.toLowerCase()
        }),
        ...(updatedData.nombres && {
          nombres: updatedData.nombres.toLowerCase()
        }),
        ...(updatedData.ciudadExpedicionDocumento && {
          ciudadExpedicionDocumento: updatedData.ciudadExpedicionDocumento.toLowerCase()
        })
      };
      try {
        await setDoc(doc(db, USUARIOS_PATH, id), dataToUpdate, {merge: true});
        dispatch(
          updateDataUser({
            ...updatedData,
            ...(updatedData.apellidos && {
              apellidos: updatedData.apellidos.toLowerCase()
            }),
            ...(updatedData.nombres && {
              nombres: updatedData.nombres.toLowerCase()
            }),
            ...(updatedData.ciudadExpedicionDocumento && {
              ciudadExpedicionDocumento: updatedData.ciudadExpedicionDocumento.toLowerCase()
            })
          })
        );
        toast.success('¡Datos actualizados correctamente!');
      } catch (error: any) {
        toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
        DebugUtil.logError(error.message, error);
      }
    },
    [dispatch]
  );

  return {updateUserData};
};

export default useUpdateUser;
