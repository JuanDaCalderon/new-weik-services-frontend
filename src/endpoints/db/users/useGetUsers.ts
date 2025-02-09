import {useCallback} from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  DocumentReference,
  getDoc
} from 'firebase/firestore';
import {db} from '@/firebase';
import {USUARIOS_PATH} from '@/constants';
import {DebugUtil, DateUtils} from '@/utils';
import {Employee, HorasTrabajoToFirestore, Permiso, Rol} from '@/types';
import toast from 'react-hot-toast';

const useGetUsers = () => {
  const getPermisos = useCallback((permisos: Array<DocumentReference> = []) => {
    return permisos.map(async (permisoRef) => {
      const permisoDocSnap = await getDoc(permisoRef);
      return {
        id: permisoDocSnap.id,
        permiso: permisoDocSnap.data()?.permiso ?? '',
        labelName: permisoDocSnap.data()?.labelName ?? ''
      } as Permiso;
    });
  }, []);

  const getRoles = useCallback(
    (roles: Array<DocumentReference> = []) => {
      return roles.map(async (rolRef) => {
        const rolDocSnap = await getDoc(rolRef);
        const thisPermisos = getPermisos(rolDocSnap.data()?.permisos);
        return {
          id: rolDocSnap.id,
          rol: rolDocSnap.data()?.rol ?? '',
          permisos: thisPermisos ? await Promise.all(thisPermisos) : []
        } as Omit<
          Rol,
          | 'descripcion'
          | 'usuarioCreacion'
          | 'fechaCreacion'
          | 'fechaActualizacion'
          | 'usuarioUpdated'
        >;
      });
    },
    [getPermisos]
  );

  const getLoggedInUser = useCallback(
    async (userEmail: string): Promise<Employee | null> => {
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
          fechaCreacion,
          cargo,
          roles,
          permisosOtorgados,
          permisosDenegados,
          horario,
          horasTrabajo,
          informacionLaboral,
          vacaciones
        } = firstDoc.data();
        const thisRoles = getRoles(roles);
        const thisPermisosOtorgados = getPermisos(permisosOtorgados);
        const thisPermisosDenegados = getPermisos(permisosDenegados);
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
          fechaCreacion: fechaCreacion
            ? DateUtils.formatDateToString((fechaCreacion as Timestamp).toDate())
            : DateUtils.formatDateToString(new Date()),
          cargo: cargo ?? '',
          roles: thisRoles ? await Promise.all(thisRoles) : [],
          permisosOtorgados: thisPermisosOtorgados ? await Promise.all(thisPermisosOtorgados) : [],
          permisosDenegados: thisPermisosDenegados ? await Promise.all(thisPermisosDenegados) : [],
          horario: horario ?? [],
          horasTrabajo:
            ((horasTrabajo as HorasTrabajoToFirestore[]) || []).map((h) => ({
              ...h,
              checkIn: DateUtils.formatDateToString(h.checkIn.toDate()),
              checkOut:
                h.checkOut === null ? null : DateUtils.formatDateToString(h.checkOut.toDate())
            })) ?? [],
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
    },
    [getPermisos, getRoles]
  );

  return {
    getLoggedInUser
  };
};

export default useGetUsers;
