import {useCallback} from 'react';
import {
  collection,
  getDocs,
  query,
  Timestamp,
  DocumentReference,
  getDoc,
  Unsubscribe,
  onSnapshot
} from 'firebase/firestore';
import {db} from '@/firebase';
import {USUARIOS_PATH} from '@/constants';
import {DebugUtil, DateUtils} from '@/utils';
import {Employee, Permiso, Rol} from '@/types';
import {useDispatch} from 'react-redux';
import {setUsers, clearUsers} from '@/store/slices/users';

const useGetEmployees = () => {
  const dispatch = useDispatch();

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

  const getEmployeesListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(query(collection(db, USUARIOS_PATH)), async (querySnapshotDocs) => {
        const employees: Employee[] = [];
        for (const doc of querySnapshotDocs.docs) {
          const {
            email,
            nombres,
            apellidos,
            userName,
            userImage,
            fechaNacimiento,
            numeroDocumento,
            ciudadExpedicionDocumento,
            estado,
            cargo,
            roles,
            permisosOtorgados,
            permisosDenegados,
            horario,
            horasExtra,
            horasTrabajo,
            vacaciones,
            informacionLaboral
          } = doc.data();
          const thisRoles = getRoles(roles);
          const thisPermisosOtorgados = getPermisos(permisosOtorgados);
          const thisPermisosDenegados = getPermisos(permisosDenegados);
          const employee: Employee = {
            id: doc.id,
            email,
            nombres: nombres ?? '',
            apellidos: apellidos ?? '',
            userName: userName ?? '',
            userImage: userImage ?? '',
            fechaNacimiento: fechaNacimiento
              ? DateUtils.formatDateToString((fechaNacimiento as Timestamp).toDate())
              : DateUtils.formatDateToString(new Date()),
            numeroDocumento: numeroDocumento ?? '',
            ciudadExpedicionDocumento: ciudadExpedicionDocumento ?? '',
            estado: estado ?? '',
            cargo: cargo ?? '',
            roles: thisRoles ? await Promise.all(thisRoles) : [],
            permisosOtorgados: thisPermisosOtorgados
              ? await Promise.all(thisPermisosOtorgados)
              : [],
            permisosDenegados: thisPermisosDenegados
              ? await Promise.all(thisPermisosDenegados)
              : [],
            horario: horario ?? [],
            horasExtra: horasExtra ?? [],
            horasTrabajo: horasTrabajo ?? [],
            informacionLaboral: informacionLaboral ?? [],
            vacaciones: vacaciones ?? []
          };
          employees.push(employee);
        }
        dispatch(clearUsers());
        dispatch(setUsers(employees));
        DebugUtil.logSuccess('Se cargaron exitosamente los usuarios en la store');
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch, getPermisos, getRoles]);

  const getEmployeesSync = useCallback(async (): Promise<void> => {
    try {
      const employees: Employee[] = [];
      const queryDocs = await getDocs(query(collection(db, USUARIOS_PATH)));
      for (const doc of queryDocs.docs) {
        const {
          email,
          nombres,
          apellidos,
          userName,
          userImage,
          fechaNacimiento,
          numeroDocumento,
          ciudadExpedicionDocumento,
          estado,
          cargo,
          roles,
          permisosOtorgados,
          permisosDenegados,
          horario,
          horasExtra,
          horasTrabajo,
          vacaciones,
          informacionLaboral
        } = doc.data();
        const thisRoles = getRoles(roles);
        const thisPermisosOtorgados = getPermisos(permisosOtorgados);
        const thisPermisosDenegados = getPermisos(permisosDenegados);
        const employee: Employee = {
          id: doc.id,
          email,
          nombres: nombres ?? '',
          apellidos: apellidos ?? '',
          userName: userName ?? '',
          userImage: userImage ?? '',
          fechaNacimiento: fechaNacimiento
            ? DateUtils.formatDateToString((fechaNacimiento as Timestamp).toDate())
            : DateUtils.formatDateToString(new Date()),
          numeroDocumento: numeroDocumento ?? '',
          ciudadExpedicionDocumento: ciudadExpedicionDocumento ?? '',
          estado: estado ?? '',
          cargo: cargo ?? '',
          roles: thisRoles ? await Promise.all(thisRoles) : [],
          permisosOtorgados: thisPermisosOtorgados ? await Promise.all(thisPermisosOtorgados) : [],
          permisosDenegados: thisPermisosDenegados ? await Promise.all(thisPermisosDenegados) : [],
          horario: horario ?? [],
          horasExtra: horasExtra ?? [],
          horasTrabajo: horasTrabajo ?? [],
          informacionLaboral: informacionLaboral ?? [],
          vacaciones: vacaciones ?? []
        };
        employees.push(employee);
      }
      dispatch(setUsers(employees));
      DebugUtil.logSuccess('Se cargaron exitosamente los usuarios en la store sincronamente');
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [dispatch, getPermisos, getRoles]);

  return {
    getEmployeesSync,
    getEmployeesListener
  };
};

export default useGetEmployees;
