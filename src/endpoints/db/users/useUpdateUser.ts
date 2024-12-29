import {PERMISOS_PATH, ROLES_PATH, USUARIOS_PATH} from '@/constants';
import {db} from '@/firebase';
import {updateDataUser} from '@/store/slices/user';
import {PartialEmployee, PermisoByRoles, UsuarioCargoEdit} from '@/types';
import {DebugUtil} from '@/utils';
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentReference,
  setDoc,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import {useCallback, useState} from 'react';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';

const useUpdateUser = () => {
  const [isLoadingUpdateCargo, setIsLoadingUpdateCargo] = useState<boolean>(false);
  const [isLoadingUsersToRol, setIsLoadingUsersToRol] = useState<boolean>(false);
  const [isLoadingUpdatePermisosOtorgados, setIsLoadingUpdatePermisosOtorgados] =
    useState<boolean>(false);
  const [isLoadingUpdatePermisosDenegados, setIsLoadingUpdatePermisosDenegados] =
    useState<boolean>(false);
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

  const updateUserCargo = useCallback(
    async (userId: string, userCargoUpdated: UsuarioCargoEdit) => {
      setIsLoadingUpdateCargo(true);
      try {
        await setDoc(doc(db, USUARIOS_PATH, userId), userCargoUpdated, {merge: true});
        DebugUtil.logSuccess('El cargo del usuario se actualizó correctamente.');
        toast.success('El cargo del usuario se actualizó correctamente.');
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
        toast.error(
          'Se produjo un error actualizando el cargo del usuario, intenta de nuevo más tarde!'
        );
      } finally {
        setIsLoadingUpdateCargo(false);
      }
    },
    []
  );

  const updatedRolesOfUser = useCallback(async (userId: string, newRoles: string[] = []) => {
    setIsLoadingUsersToRol(true);
    try {
      const userDocRef = doc(db, USUARIOS_PATH, userId);
      let rolDocRef: DocumentReference;
      const newRolDocsRefs: DocumentReference[] = [];
      for (const roleId of newRoles) {
        rolDocRef = doc(db, ROLES_PATH, roleId);
        newRolDocsRefs.push(rolDocRef);
      }
      await updateDoc(userDocRef, {
        roles: newRolDocsRefs
      });
      DebugUtil.logSuccess(`Los roles se han actualizado correctamente a este usuario.`);
      toast.success('Los roles se han actualizado correctamente a este usuario.');
    } catch (error: any) {
      DebugUtil.logError(error.message, error);
      toast.error('Ocurrió un error actualizando los roles del usuario');
    } finally {
      setIsLoadingUsersToRol(false);
    }
  }, []);

  const agregarPermisoOtorgadoToUser = useCallback(
    async (userId: string, permisoRef: DocumentReference) => {
      try {
        const userDocRef = doc(db, USUARIOS_PATH, userId);
        await updateDoc(userDocRef, {
          permisosOtorgados: arrayUnion(permisoRef)
        });
        DebugUtil.logSuccess(
          `Se ha agregado el permiso otorgado correctamente al usuario con id: ${userId}`
        );
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      }
    },
    []
  );

  const quitarPermisoOtorgadoToUser = useCallback(
    async (userId: string, permisoRef: DocumentReference) => {
      try {
        const userDocRef = doc(db, USUARIOS_PATH, userId);
        await updateDoc(userDocRef, {
          permisosOtorgados: arrayRemove(permisoRef)
        });
        DebugUtil.logSuccess(
          `Se ha quitado el permiso otorgado correctamente al usuario con id: ${userId}`
        );
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      }
    },
    []
  );

  const updatePermisosOtorgadosOfUser = useCallback(
    async (userId: string, permisosOtorgados: PermisoByRoles[]) => {
      setIsLoadingUpdatePermisosOtorgados(true);
      try {
        for (const permiso of permisosOtorgados) {
          const permisoRef = doc(db, PERMISOS_PATH, permiso.id);
          if (permiso.activo) await agregarPermisoOtorgadoToUser(userId, permisoRef);
          else await quitarPermisoOtorgadoToUser(userId, permisoRef);
        }
        toast.success('Los permisos otorgados del usuario se han actualizado correctamente.');
      } catch (error: any) {
        toast.error('Ha ocurrido un error al actualizar los permisos otorgados del usuario');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingUpdatePermisosOtorgados(false);
      }
    },
    [agregarPermisoOtorgadoToUser, quitarPermisoOtorgadoToUser]
  );

  const agregarPermisoDenegadoToUser = useCallback(
    async (userId: string, permisoRef: DocumentReference) => {
      try {
        const userDocRef = doc(db, USUARIOS_PATH, userId);
        await updateDoc(userDocRef, {
          permisosDenegados: arrayUnion(permisoRef)
        });
        DebugUtil.logSuccess(
          `Se ha agregado el permiso denegado correctamente al usuario con id: ${userId}`
        );
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      }
    },
    []
  );

  const quitarPermisoDenegadoToUser = useCallback(
    async (userId: string, permisoRef: DocumentReference) => {
      try {
        const userDocRef = doc(db, USUARIOS_PATH, userId);
        await updateDoc(userDocRef, {
          permisosDenegados: arrayRemove(permisoRef)
        });
        DebugUtil.logSuccess(
          `Se ha quitado el permiso denegado correctamente al usuario con id: ${userId}`
        );
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      }
    },
    []
  );

  const updatePermisosDenegadosOfUser = useCallback(
    async (userId: string, permisosDenegados: PermisoByRoles[]) => {
      setIsLoadingUpdatePermisosDenegados(true);
      try {
        for (const permiso of permisosDenegados) {
          const permisoRef = doc(db, PERMISOS_PATH, permiso.id);
          if (permiso.activo) await agregarPermisoDenegadoToUser(userId, permisoRef);
          else await quitarPermisoDenegadoToUser(userId, permisoRef);
        }
        toast.success('Los permisos denegados del usuario se han actualizado correctamente.');
      } catch (error: any) {
        toast.error('Ha ocurrido un error al actualizar los permisos denegados del usuario');
        DebugUtil.logError(error.message, error);
      } finally {
        setIsLoadingUpdatePermisosDenegados(false);
      }
    },
    [agregarPermisoDenegadoToUser, quitarPermisoDenegadoToUser]
  );

  return {
    isLoadingUpdateCargo,
    isLoadingUsersToRol,
    isLoadingUpdatePermisosOtorgados,
    isLoadingUpdatePermisosDenegados,
    updateUserData,
    updateUserCargo,
    updatedRolesOfUser,
    updatePermisosOtorgadosOfUser,
    updatePermisosDenegadosOfUser
  };
};

export default useUpdateUser;
