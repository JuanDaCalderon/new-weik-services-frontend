import {useEffect, useMemo} from 'react';
import {useAppSelector} from '@/store';
import {
  selectEmployees,
  selectEventos,
  selectisLoadingEmployees,
  selectIsLoadingEventos,
  selectUser
} from '@/store/selectores';
import {useGetEmployees, useGetEventos} from '@/endpoints';
import {hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';

export default function useCalendario() {
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const eventos = useAppSelector(selectEventos);
  const isLoadingEventos = useAppSelector(selectIsLoadingEventos);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();
  const {getEventosSync} = useGetEventos();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  useEffect(() => {
    if (eventos.length <= 0) getEventosSync();
  }, [eventos.length, getEventosSync]);

  const canCrearHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canCrearEventos = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearEventos, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEditarHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.editarHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEditarEventos = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.editarEventos, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEliminarHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.eliminarHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canEliminarEventos = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.eliminarEventos, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return {
    thisUserActive: user,
    users,
    eventos,
    isLoadingEventos,
    isLoadingUsers,
    getEmployeesSync,
    getEventosSync,
    canCrearHorarios,
    canCrearEventos,
    canEditarHorarios,
    canEditarEventos,
    canEliminarHorarios,
    canEliminarEventos,
    canAccesoHorarios
  };
}
