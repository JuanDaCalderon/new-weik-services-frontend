import {useEffect, useMemo} from 'react';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {EventInput} from '@fullcalendar/core';
import {useGetEmployees} from '@/endpoints';
import {DateUtils, hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';
import useGetHorarios from '@/endpoints/db/horarios/useGetHorarios';
import {selectHorarios, selectIsLoadingHorarios} from '@/store/selectores/horarios';
import {Employee} from '@/types';

export default function useHorarios(selectedUser: Employee | null) {
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const horarios = useAppSelector(selectHorarios);
  const isLoadingHorarios = useAppSelector(selectIsLoadingHorarios);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();
  const {getHorariosListener} = useGetHorarios();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  useEffect(() => {
    const unsubscribe = getHorariosListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getHorariosListener]);

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

  const events = useMemo(() => {
    const createEventInput = (
      id: string,
      title: string,
      start: Date,
      end: Date,
      className: string,
      extendedProps: any
    ): EventInput => ({
      id,
      title,
      className,
      start,
      end,
      allDay: true,
      durationEditable: false,
      editable: false,
      interactive: false,
      startEditable: false,
      extendedProps
    });
    if (!selectedUser) return [];
    const userHorarios = horarios.filter((h) => h.userId === selectedUser.id);
    return userHorarios.map((h, i) => {
      const start = DateUtils.parseStringToDate(h.rangoFechas[0]);
      const end = DateUtils.addDays(DateUtils.parseStringToDate(h.rangoFechas[1]), 1);
      const title = `Hora entrada ${DateUtils.convertTo12HourFormat(h.horaInicio)} - ${h.horasDeTrabajo} Horas - ${h.break} Minutos de break`;
      return createEventInput(`horario-${h.id}-${h.userId}-${i}`, title, start, end, 'bg-primary', h);
    });
  }, [horarios, selectedUser]);

  return {
    thisUserActive: user,
    events,
    isLoadingHorarios,
    users,
    isLoadingUsers,
    canCrearHorarios,
    canEditarHorarios,
    canEliminarHorarios,
    canAccesoHorarios
  };
}
