import {useEffect, useMemo} from 'react';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';

export default function useHorarios() {
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  const canCrearHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEditarHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.editarHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEliminarHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.eliminarHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return {
    thisUserActive: user,
    users,
    isLoadingUsers,
    getEmployeesSync,
    canCrearHorarios,
    canEditarHorarios,
    canEliminarHorarios,
    canAccesoHorarios
  };
}
