import {useCallback} from 'react';
import {
  collection,
  DocumentReference,
  getDoc,
  Unsubscribe,
  onSnapshot,
  query,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import {db} from '@/firebase';
import {PERMISOS_PATH, ROLES_PATH} from '@/constants';
import {Rol, Permiso, Employee} from '@/types';
import {useDispatch} from 'react-redux';
import {clearPermisos, clearRoles, setPermisos, setRoles} from '@/store/slices/roles-permisos';
import {DateUtils, DebugUtil} from '@/utils';

const useRolesYPermisos = () => {
  const dispatch = useDispatch();

  const getPermisos = useCallback((permisos: Array<DocumentReference> = []) => {
    return permisos.map(async (permisoRef) => {
      const permisoDocSnap = await getDoc(permisoRef);
      return {
        id: permisoDocSnap.id,
        permiso: permisoDocSnap.data()?.permiso ?? ''
      } as Permiso;
    });
  }, []);

  const getRolesListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(query(collection(db, ROLES_PATH)), async (querySnapshotDocs) => {
        const roles: Rol[] = [];
        for (const doc of querySnapshotDocs.docs) {
          const {
            rol,
            descripcion,
            permisos,
            fechaCreacion,
            fechaActualizacion,
            usuarioCreacion,
            usuarioUpdated
          } = doc.data();
          const thisPermisos: Promise<Permiso>[] = getPermisos(permisos);
          const docSnap = await getDoc(usuarioCreacion as DocumentReference);
          const thisUsuarioCreacion: Pick<
            Employee,
            'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'
          > = {
            email: docSnap.data()?.email ?? '',
            apellidos: docSnap.data()?.apellidos ?? '',
            nombres: docSnap.data()?.nombres ?? '',
            userImage: docSnap.data()?.userImage ?? '',
            userName: docSnap.data()?.userName ?? ''
          };
          const docSnapUpdated = await getDoc(usuarioUpdated as DocumentReference);
          const thisUsuarioUpdated: Pick<
            Employee,
            'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'
          > = {
            email: docSnapUpdated.data()?.email ?? '',
            apellidos: docSnapUpdated.data()?.apellidos ?? '',
            nombres: docSnapUpdated.data()?.nombres ?? '',
            userImage: docSnapUpdated.data()?.userImage ?? '',
            userName: docSnapUpdated.data()?.userName ?? ''
          };
          roles.push({
            id: doc.id,
            rol: rol ?? '',
            descripcion: descripcion ?? '',
            permisos: thisPermisos ? await Promise.all(thisPermisos) : [],
            fechaCreacion: fechaCreacion
              ? DateUtils.formatDateToString((fechaCreacion as Timestamp).toDate())
              : DateUtils.formatDateToString(new Date()),
            fechaActualizacion: fechaActualizacion
              ? DateUtils.formatDateToString((fechaActualizacion as Timestamp).toDate())
              : DateUtils.formatDateToString(new Date()),
            usuarioCreacion: thisUsuarioCreacion,
            usuarioUpdated: thisUsuarioUpdated
          });
        }
        dispatch(clearRoles());
        dispatch(setRoles(roles));
        DebugUtil.logSuccess(
          'Se han consultado los roles correctamente y ya deben estar en el store',
          roles
        );
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch, getPermisos]);

  const getRolesSync = useCallback(async (): Promise<void> => {
    try {
      const roles: Rol[] = [];
      const queryDocs = await getDocs(query(collection(db, ROLES_PATH)));
      for (const doc of queryDocs.docs) {
        const {
          rol,
          descripcion,
          permisos,
          fechaCreacion,
          fechaActualizacion,
          usuarioCreacion,
          usuarioUpdated
        } = doc.data();
        const thisPermisos: Promise<Permiso>[] = getPermisos(permisos);
        const docSnap = await getDoc(usuarioCreacion as DocumentReference);
        const thisUsuarioCreacion: Pick<
          Employee,
          'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'
        > = {
          email: docSnap.data()?.email ?? '',
          apellidos: docSnap.data()?.apellidos ?? '',
          nombres: docSnap.data()?.nombres ?? '',
          userImage: docSnap.data()?.userImage ?? '',
          userName: docSnap.data()?.userName ?? ''
        };
        const docSnapUpdated = await getDoc(usuarioUpdated as DocumentReference);
        const thisUsuarioUpdated: Pick<
          Employee,
          'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'
        > = {
          email: docSnapUpdated.data()?.email ?? '',
          apellidos: docSnapUpdated.data()?.apellidos ?? '',
          nombres: docSnapUpdated.data()?.nombres ?? '',
          userImage: docSnapUpdated.data()?.userImage ?? '',
          userName: docSnapUpdated.data()?.userName ?? ''
        };
        roles.push({
          id: doc.id,
          rol: rol ?? '',
          descripcion: descripcion ?? '',
          permisos: thisPermisos ? await Promise.all(thisPermisos) : [],
          fechaCreacion: fechaCreacion
            ? DateUtils.formatDateToString((fechaCreacion as Timestamp).toDate())
            : DateUtils.formatDateToString(new Date()),
          fechaActualizacion: fechaActualizacion
            ? DateUtils.formatDateToString((fechaActualizacion as Timestamp).toDate())
            : DateUtils.formatDateToString(new Date()),
          usuarioCreacion: thisUsuarioCreacion,
          usuarioUpdated: thisUsuarioUpdated
        });
      }
      dispatch(setRoles(roles));
      DebugUtil.logSuccess(
        'Se han consultado los roles correctamente sync y ya deben estar en el store',
        roles
      );
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [dispatch, getPermisos]);

  const getPermisosListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, PERMISOS_PATH), async (querySnapshotDocs) => {
        const permisos: Permiso[] = [];
        for (const doc of querySnapshotDocs.docs) {
          const {permiso} = doc.data();
          permisos.push({
            id: doc.id,
            permiso: permiso ?? ''
          });
        }
        dispatch(clearPermisos());
        dispatch(setPermisos(permisos));
        DebugUtil.logSuccess(
          'Se han consultado los permisos correctamente y ya deben estar en el store',
          permisos
        );
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  const getPermisosSync = useCallback(async (): Promise<void> => {
    try {
      const permisos: Permiso[] = [];
      const queryDocs = await getDocs(collection(db, PERMISOS_PATH));
      for (const doc of queryDocs.docs) {
        const {permiso} = doc.data();
        permisos.push({
          id: doc.id,
          permiso: permiso ?? ''
        });
      }
      dispatch(setPermisos(permisos));
      DebugUtil.logSuccess(
        'Se han consultado los permisos correctamente async y ya deben estar en el store',
        permisos
      );
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [dispatch]);

  return {
    getRolesListener,
    getRolesSync,
    getPermisosListener,
    getPermisosSync
  };
};

export default useRolesYPermisos;
