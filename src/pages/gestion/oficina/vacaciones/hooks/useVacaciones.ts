import {useCallback, useEffect, useMemo} from 'react';
import {EventInput} from '@fullcalendar/core';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {Vacaciones} from '@/types';
import {DateUtils, getApprovalIndicator, getStatus, hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';
import {selectIsLoadingVacaciones, selectVacaciones} from '@/store/selectores/vacaciones';
import useGetVacaciones from '@/endpoints/db/vacaciones/useGetVacaciones';
import useVacationFilters from './useVacationFilters';

export default function useVacaciones() {
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const vacaciones = useAppSelector(selectVacaciones);
  const isLoadingVacations = useAppSelector(selectIsLoadingVacaciones);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getVacacionesListener} = useGetVacaciones();
  const {getEmployeesSync} = useGetEmployees();
  const {isCheckedOnlyMyVacations, isCheckedPendingVacations, handleSwitchChange, handleSwitchChangePendingVacations} =
    useVacationFilters();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  useEffect(() => {
    const unsubscribe = getVacacionesListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getVacacionesListener]);

  const canAprobarVacaciones = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.aprobarVacaciones,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const createVacationEvent = useCallback(
    (userEmail: string, i: number, v: Vacaciones): EventInput => {
      const isMyVacations = v.userId === user.id;
      const {rangoFechas, aprobadas, approver} = v;
      const {status, statusCopy} = getStatus(aprobadas, isMyVacations);
      const canIApproveIt = approver === user.id && aprobadas === null;
      const approvalIndicator = getApprovalIndicator(canIApproveIt, aprobadas, isMyVacations);
      return {
        id: `vacaciones-${v.id}-${v.userId}-${i}`,
        title: `${isMyVacations ? 'Mis vacaciones' : 'Vacaciones de'} ${userEmail} - ${statusCopy} ${approvalIndicator}`,
        className: status,
        start: DateUtils.parseStringToDate(rangoFechas[0]),
        end: DateUtils.addDays(DateUtils.parseStringToDate(rangoFechas[1]), 1),
        allDay: true,
        durationEditable: false,
        editable: false,
        interactive: false,
        startEditable: false,
        extendedProps: {...v, isMyVacations}
      };
    },
    [user.id]
  );

  const allVacationsEvents = useMemo(() => {
    return vacaciones.map((v, i) => {
      const email = users.find((u) => u.id === v.userId)?.email || 'Usuario desconocido';
      return createVacationEvent(email, i, v);
    });
  }, [createVacationEvent, users, vacaciones]);

  const myVacationsOnlyEvents = useMemo(() => {
    return vacaciones.filter((v) => v.userId === user.id).map((v, i) => createVacationEvent(user.email, i, v));
  }, [createVacationEvent, user.email, user.id, vacaciones]);

  const events = useMemo(() => {
    if (isCheckedOnlyMyVacations) return myVacationsOnlyEvents;
    if (isCheckedPendingVacations) {
      return allVacationsEvents.filter((e) => (e.extendedProps as Vacaciones).aprobadas === null);
    }
    return allVacationsEvents;
  }, [allVacationsEvents, isCheckedOnlyMyVacations, isCheckedPendingVacations, myVacationsOnlyEvents]);

  return {
    events,
    users,
    user,
    isLoadingUsers,
    isLoadingVacations,
    canAprobarVacaciones,
    handleSwitchChange,
    handleSwitchChangePendingVacations,
    isCheckedOnlyMyVacations,
    isCheckedPendingVacations
  };
}
