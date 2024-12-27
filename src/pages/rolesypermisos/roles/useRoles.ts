import {rolesSelector} from '@/store/selectores';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores/users';
import {useCallback, useEffect, useMemo} from 'react';
import {useRolesYPermisos} from '@/endpoints';
import {RolCreationBasics, thisRol} from '@/types';
import {DateUtils, DebugUtil} from '@/utils';

export default function useRoles() {
  const {getPermisosListener, getRolesListener, createRol, isLoadingCreatinRol} =
    useRolesYPermisos();
  const rolesFromStore = useAppSelector(rolesSelector);
  const employeesFromStore = useAppSelector(selectEmployees);

  useEffect(() => {
    const rolesUnsubscribe = getRolesListener();
    const permisosUnsubscribe = getPermisosListener();
    return () => {
      rolesUnsubscribe();
      permisosUnsubscribe();
    };
  }, [getPermisosListener, getRolesListener]);

  const newRoleIndex: string = useMemo((): string => {
    let newRoleIndex: number = rolesFromStore.length + 1;
    let alreadyExist: boolean = rolesFromStore.some((rol) => rol.id === String(newRoleIndex));
    while (alreadyExist) {
      newRoleIndex++;
      alreadyExist = rolesFromStore.some((rol) => rol.id === String(newRoleIndex));
    }
    return String(newRoleIndex);
  }, [rolesFromStore]);

  const roles: thisRol[] = useMemo(() => {
    return rolesFromStore.map<thisRol>((rol) => {
      const {id} = rol;
      const numeroRoles: number = rol.permisos.length;
      const numeroUsuarios: number = employeesFromStore.reduce((acc, employee) => {
        if (employee.roles.some((thisRol) => thisRol.id === rol.id)) return acc + 1;
        else return acc;
      }, 0);
      return {
        id: +id,
        rolName: rol.rol,
        descripcion: rol.descripcion,
        createdBy: rol.usuarioCreacion.email,
        ribbonCreatedDate: DateUtils.parseStringToDate(rol.fechaCreacion),
        ribbonUpdatedDate: DateUtils.parseStringToDate(rol.fechaActualizacion),
        createdDate: DateUtils.formatShortDate(DateUtils.parseStringToDate(rol.fechaCreacion)),
        updatedBy: rol.usuarioUpdated.email,
        updatedDate: DateUtils.formatShortDate(
          DateUtils.parseStringToDate(rol.fechaActualizacion),
          true
        ),
        RolePermisos: `${numeroRoles} ${numeroRoles === 1 ? 'permiso' : 'permisos'}`,
        RoleUsuarios: `${numeroUsuarios} ${numeroUsuarios === 1 ? 'usuario' : 'usuarios'}`,
        usuarios: employeesFromStore.filter((employee) =>
          employee.roles.some((thisRol) => thisRol.id === String(id))
        )
      };
    });
  }, [employeesFromStore, rolesFromStore]);

  const sendRol = useCallback(
    async (rolCreationBasics: RolCreationBasics) => {
      try {
        await createRol(rolCreationBasics, newRoleIndex);
      } catch (error: any) {
        DebugUtil.logError(error.message, error);
      }
    },
    [createRol, newRoleIndex]
  );

  return {roles, sendRol, isLoadingCreatinRol};
}
