import {useCallback} from 'react';
import {collection, getDocs, query, where, Timestamp} from 'firebase/firestore';
import {db} from '@/firebase';
import {USUARIOS_PATH} from '@/constants';
import {DebugUtil, DateUtils} from '@/utils';
import {Employee} from '@/types';
import toast from 'react-hot-toast';

const useGetUsers = () => {
  const getLoggedInUser = useCallback(async (userEmail: string): Promise<Employee | null> => {
    let usuario: Employee | null = null;
    try {
      const queryDocs = await getDocs(
        query(collection(db, USUARIOS_PATH), where('email', '==', userEmail))
      );
      const firstDoc = queryDocs.docs[0];
      if (!firstDoc) throw new Error('El usuario no persiste en la base de datos.');
      const {
        email,
        nombres,
        apellidos,
        userName,
        ciudadExpedicionDocumento,
        numeroDocumento,
        userImage,
        estado,
        fechaNacimiento,
        roles,
        permisos,
        horario,
        horasExtra,
        horasTrabajo,
        informacionLaboral,
        vacaciones
      } = firstDoc.data();
      usuario = {
        id: firstDoc.id,
        email,
        nombres: nombres ?? '',
        apellidos: apellidos ?? '',
        userName: userName ?? '',
        userImage: userImage ?? '',
        ciudadExpedicionDocumento: ciudadExpedicionDocumento ?? '',
        numeroDocumento: numeroDocumento ?? '',
        estado: estado ?? '',
        fechaNacimiento: fechaNacimiento
          ? DateUtils.formatDateToString((fechaNacimiento as Timestamp).toDate())
          : DateUtils.formatDateToString(new Date()),
        roles: roles ?? [],
        permisos: permisos ?? [],
        horario: horario ?? [],
        horasExtra: horasExtra ?? [],
        horasTrabajo: horasTrabajo ?? [],
        informacionLaboral: informacionLaboral ?? [],
        vacaciones: vacaciones ?? []
      };
      DebugUtil.logSuccess(
        'El usuario se ha consultado correctamente desde la base de datos',
        usuario
      );
    } catch (error: any) {
      if (error.message === 'El usuario no persiste en la base de datos.')
        toast.error(error.message);
      else toast.error('¡Ups ha ocurrido un error, intenta de nuevo más tarde!');
      DebugUtil.logError(error.message, error);
    }
    return usuario;
  }, []);

  return {
    getLoggedInUser
  };
};

export default useGetUsers;
