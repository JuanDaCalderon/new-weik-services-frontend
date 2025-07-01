import {useCallback, useState} from 'react';
import {
  collection,
  DocumentReference,
  getDoc,
  Unsubscribe,
  onSnapshot,
  query,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc
} from 'firebase/firestore';
import {db} from '@/firebase';
import {FIRESTORE_PERMISOS_PATH, FIRESTORE_ROLES_PATH, FIRESTORE_USUARIOS_PATH} from '@/constants';
import {Rol, Permiso, Employee, PermisoByRoles, RolCreationBasics} from '@/types';
import {useDispatch} from 'react-redux';
import {clearPermisos, clearRoles, setPermisos, setRoles} from '@/store/slices/roles-permisos';
import {DateUtils, DebugUtil} from '@/utils';
import toast from 'react-hot-toast';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const useRolesYPermisos = () => {
  const [isLoadingCreatinRol, setIsLoadingCreatinRol] = useState<boolean>(false);
  const [isLoadingUpdatingPermisos, setIsLoadingUpdatingPermisos] = useState<boolean>(false);
  const [isLoadingAddAndRemoveRolToUser, setIsLoadingAddAndRemoveRolToUser] = useState<boolean>(false);
  const [isLoadingUpdatingBasics, setIsLoadingUpdatingBasics] = useState<boolean>(false);
  const {id} = useAppSelector(selectUser);
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

  const getRolesListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(query(collection(db, FIRESTORE_ROLES_PATH)), async (querySnapshotDocs) => {
        const roles: Rol[] = [];
        for (const doc of querySnapshotDocs.docs) {
          const {
            rol,
            descripcion,
            permisos,
            fechaCreacion,
            fechaActualizacion,
            usuarioCreacion,
            usuarioUpdated,
            isMainRol
          } = doc.data();
          const thisPermisos: Promise<Permiso>[] = getPermisos(permisos);
          const docSnap = await getDoc(usuarioCreacion as DocumentReference);
          const thisUsuarioCreacion: Pick<Employee, 'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'> = {
            email: docSnap.data()?.email ?? '',
            apellidos: docSnap.data()?.apellidos ?? '',
            nombres: docSnap.data()?.nombres ?? '',
            userImage: docSnap.data()?.userImage ?? '',
            userName: docSnap.data()?.userName ?? ''
          };
          const docSnapUpdated = await getDoc(usuarioUpdated as DocumentReference);
          const thisUsuarioUpdated: Pick<Employee, 'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'> = {
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
            usuarioUpdated: thisUsuarioUpdated,
            isMainRol: isMainRol ?? false // Aseguramos que el campo isMainRol exista
          });
        }
        dispatch(clearRoles());
        dispatch(setRoles(roles));
        DebugUtil.logSuccess('Se han consultado los roles correctamente y ya deben estar en el store', roles);
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch, getPermisos]);

  const getRolesSync = useCallback(async (): Promise<void> => {
    try {
      const roles: Rol[] = [];
      const queryDocs = await getDocs(query(collection(db, FIRESTORE_ROLES_PATH)));
      for (const doc of queryDocs.docs) {
        const {
          rol,
          descripcion,
          permisos,
          fechaCreacion,
          fechaActualizacion,
          usuarioCreacion,
          usuarioUpdated,
          isMainRol
        } = doc.data();
        const thisPermisos: Promise<Permiso>[] = getPermisos(permisos);
        const docSnap = await getDoc(usuarioCreacion as DocumentReference);
        const thisUsuarioCreacion: Pick<Employee, 'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'> = {
          email: docSnap.data()?.email ?? '',
          apellidos: docSnap.data()?.apellidos ?? '',
          nombres: docSnap.data()?.nombres ?? '',
          userImage: docSnap.data()?.userImage ?? '',
          userName: docSnap.data()?.userName ?? ''
        };
        const docSnapUpdated = await getDoc(usuarioUpdated as DocumentReference);
        const thisUsuarioUpdated: Pick<Employee, 'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'> = {
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
          usuarioUpdated: thisUsuarioUpdated,
          isMainRol: isMainRol ?? false // Aseguramos que el campo isMainRol exista
        });
      }
      dispatch(setRoles(roles));
      DebugUtil.logSuccess('Se han consultado los roles correctamente sync y ya deben estar en el store', roles);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [dispatch, getPermisos]);

  const getPermisosListener = useCallback((): Unsubscribe => {
    let unsubscribe: Unsubscribe = {} as Unsubscribe;
    try {
      unsubscribe = onSnapshot(collection(db, FIRESTORE_PERMISOS_PATH), async (querySnapshotDocs) => {
        const permisos: Permiso[] = [];
        for (const doc of querySnapshotDocs.docs) {
          const {permiso, labelName} = doc.data();
          permisos.push({
            id: doc.id,
            permiso: permiso ?? '',
            labelName: labelName ?? ''
          });
        }
        dispatch(clearPermisos());
        dispatch(setPermisos(permisos));
        DebugUtil.logSuccess('Se han consultado los permisos correctamente y ya deben estar en el store', permisos);
      });
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
    return unsubscribe;
  }, [dispatch]);

  const getPermisosSync = useCallback(async (): Promise<void> => {
    try {
      const permisos: Permiso[] = [];
      const queryDocs = await getDocs(collection(db, FIRESTORE_PERMISOS_PATH));
      for (const doc of queryDocs.docs) {
        const {permiso, labelName} = doc.data();
        permisos.push({
          id: doc.id,
          permiso: permiso ?? '',
          labelName: labelName ?? ''
        });
      }
      dispatch(setPermisos(permisos));
      DebugUtil.logSuccess('Se han consultado los permisos correctamente async y ya deben estar en el store', permisos);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, [dispatch]);

  const agregarPermisoARol = useCallback(async (rolId: string, permisoRef: DocumentReference) => {
    try {
      const rolDocRef = doc(db, FIRESTORE_ROLES_PATH, rolId);
      await updateDoc(rolDocRef, {
        permisos: arrayUnion(permisoRef)
      });
      DebugUtil.logSuccess(`Se ha agregado el permiso correctamente al rol con id: ${rolId}`);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, []);

  const quitarPermisoDeRol = useCallback(async (rolId: string, permisoRef: DocumentReference) => {
    try {
      const rolDocRef = doc(db, FIRESTORE_ROLES_PATH, rolId);
      await updateDoc(rolDocRef, {
        permisos: arrayRemove(permisoRef)
      });
      DebugUtil.logSuccess(`Se ha quitado el permiso correctamente al rol con id: ${rolId}`);
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
    }
  }, []);

  const updateActualizadoUserAndDate = useCallback(
    async (rolId: string) => {
      try {
        const rolDocRef = doc(db, FIRESTORE_ROLES_PATH, rolId);
        const userDocRef = doc(db, FIRESTORE_USUARIOS_PATH, id);
        await updateDoc(rolDocRef, {
          usuarioUpdated: userDocRef,
          fechaActualizacion: Timestamp.now()
        });
        DebugUtil.logSuccess(`Se ha actualizado el usuario y hora de actualización del rol`);
      } catch (error: any) {
        toast.error('Ha ocurrido un error al actualizar el usuario y hora de actualización del rol');
        DebugUtil.logError(error.message, error);
      }
    },
    [id]
  );

  const updatePermisosDeRol = useCallback(
    async (rolId: string, permisosCambiados: PermisoByRoles[]) => {
      setIsLoadingUpdatingPermisos(true);
      try {
        for (const permiso of permisosCambiados) {
          const permisoRef = doc(db, FIRESTORE_PERMISOS_PATH, permiso.id);
          if (permiso.activo) await agregarPermisoARol(rolId, permisoRef);
          else await quitarPermisoDeRol(rolId, permisoRef);
          await updateActualizadoUserAndDate(rolId);
        }
        toast.success('Se han actualizado los permisos del rol correctamente');
      } catch (error: any) {
        toast.error('Ha ocurrido un error al actualizar los permisos del rol');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingUpdatingPermisos(false);
      }
    },
    [agregarPermisoARol, quitarPermisoDeRol, updateActualizadoUserAndDate]
  );

  const createRol = useCallback(
    async (rolCreationBasics: RolCreationBasics, newRoleIndex: string) => {
      setIsLoadingCreatinRol(true);
      try {
        const userDocRef = doc(db, FIRESTORE_USUARIOS_PATH, id);
        await setDoc(doc(db, FIRESTORE_ROLES_PATH, newRoleIndex), {
          rol: rolCreationBasics.rol?.toLowerCase(),
          descripcion: rolCreationBasics.descripcion?.toLowerCase(),
          permisos: [],
          usuarioCreacion: userDocRef,
          usuarioUpdated: userDocRef,
          fechaActualizacion: Timestamp.now(),
          fechaCreacion: Timestamp.now(),
          isMainRol: false
        });
        DebugUtil.logSuccess(`Rol ${rolCreationBasics.rol} creado correctamente`);
        toast.success(`Rol ${rolCreationBasics.rol} creado correctamente`);
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
        toast.error('Ocurrió un error al intentar crear el rol, por favor intenta de nuevo más tarde');
      } finally {
        setIsLoadingCreatinRol(false);
      }
    },
    [id]
  );

  const addRolToUser = useCallback(async (roleId: string, addUsers: string[] = []) => {
    setIsLoadingAddAndRemoveRolToUser(true);
    try {
      if (addUsers.length > 0) {
        let userDocRef: DocumentReference;
        const rolDocRef = doc(db, FIRESTORE_ROLES_PATH, roleId);
        for (const userId of addUsers) {
          userDocRef = doc(db, FIRESTORE_USUARIOS_PATH, userId);
          await updateDoc(userDocRef, {
            roles: arrayUnion(rolDocRef)
          });
        }
        DebugUtil.logSuccess(`Se ha agregado este rol a los usuarios`);
        toast.success('Se han agregado los usuarios del rol correctamente');
      }
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
      toast.error('Ocurrió un error durante el proceso de asignación de este rol a los usuarios.');
    } finally {
      setIsLoadingAddAndRemoveRolToUser(false);
    }
  }, []);

  const removeRolToUser = useCallback(async (roleId: string, removeUsers: string[] = []) => {
    setIsLoadingAddAndRemoveRolToUser(true);
    try {
      if (removeUsers.length > 0) {
        let userDocRef: DocumentReference;
        const rolDocRef = doc(db, FIRESTORE_ROLES_PATH, roleId);
        for (const userId of removeUsers) {
          userDocRef = doc(db, FIRESTORE_USUARIOS_PATH, userId);
          await updateDoc(userDocRef, {
            roles: arrayRemove(rolDocRef)
          });
        }
        DebugUtil.logSuccess(`Se ha removido este rol de los usuarios`);
        toast.success('Se han removido los usuarios del rol correctamente');
      }
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
      toast.error('Ocurrió un error durante el proceso de remover este rol de los usuarios.');
    } finally {
      setIsLoadingAddAndRemoveRolToUser(false);
    }
  }, []);

  const updateRolBasics = useCallback(
    async (roleId: string, rolBasicsUpdated: RolCreationBasics) => {
      setIsLoadingUpdatingBasics(true);
      try {
        const rolDocRef = doc(db, FIRESTORE_ROLES_PATH, roleId);
        await updateDoc(rolDocRef, {
          ...rolBasicsUpdated
        });
        await updateActualizadoUserAndDate(roleId);
        DebugUtil.logSuccess('El rol se actualizó correctamente.');
        toast.success('El rol se actualizó correctamente.');
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
        toast.error('Se produjo un error al actualizar los datos del rol.');
      } finally {
        setIsLoadingUpdatingBasics(false);
      }
    },
    [updateActualizadoUserAndDate]
  );

  return {
    getRolesListener,
    getRolesSync,
    getPermisosListener,
    getPermisosSync,
    updatePermisosDeRol,
    createRol,
    addRolToUser,
    removeRolToUser,
    updateRolBasics,
    isLoadingCreatinRol,
    isLoadingUpdatingPermisos,
    isLoadingAddAndRemoveRolToUser,
    isLoadingUpdatingBasics
  };
};

export default useRolesYPermisos;
