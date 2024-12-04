import {useCallback} from 'react';
import {
  collection,
  DocumentReference,
  getDoc,
  Unsubscribe,
  onSnapshot,
  query,
  getDocs
} from 'firebase/firestore';
import {db} from '@/firebase';
import {PERMISOS_PATH, ROLES_PATH} from '@/constants';
import {Rol, Permiso} from '@/types';
import {useDispatch} from 'react-redux';
import {clearPermisos, clearRoles, setPermisos, setRoles} from '@/store/slices/roles-permisos';
import {DebugUtil} from '@/utils';

const useRolesYPermisos = () => {
  const dispatch = useDispatch();

  const getRolesListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(query(collection(db, ROLES_PATH)), async (querySnapshotDocs) => {
        const roles: Rol[] = [];
        for (const doc of querySnapshotDocs.docs) {
          const {rol, permisos} = doc.data();
          const thisPermisos: Promise<Permiso>[] = (permisos as Array<DocumentReference>).map(
            async (permisoRef) => {
              const docSnap = await getDoc(permisoRef);
              return {
                id: docSnap.id,
                permiso: docSnap.data()?.permiso ?? ''
              } as Permiso;
            }
          );
          roles.push({
            id: doc.id,
            rol,
            permisos: await Promise.all(thisPermisos)
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
  }, [dispatch]);

  const getRolesSync = useCallback(async (): Promise<void> => {
    try {
      const roles: Rol[] = [];
      const queryDocs = await getDocs(query(collection(db, ROLES_PATH)));
      for (const doc of queryDocs.docs) {
        const {rol, permisos} = doc.data();
        const thisPermisos: Promise<Permiso>[] = (permisos as Array<DocumentReference>).map(
          async (permisoRef) => {
            const docSnap = await getDoc(permisoRef);
            return {
              id: docSnap.id,
              permiso: docSnap.data()?.permiso ?? ''
            } as Permiso;
          }
        );
        roles.push({
          id: doc.id,
          rol,
          permisos: await Promise.all(thisPermisos)
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
  }, [dispatch]);

  const getPermisosListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, PERMISOS_PATH), async (querySnapshotDocs) => {
        const permisos: Permiso[] = [];
        for (const doc of querySnapshotDocs.docs) {
          const {permiso} = doc.data();
          permisos.push({
            id: doc.id,
            permiso
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
          permiso
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
