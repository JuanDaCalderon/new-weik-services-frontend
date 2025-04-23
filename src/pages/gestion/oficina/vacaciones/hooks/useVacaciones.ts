import {useCallback, useEffect, useMemo} from 'react';
import {EventInput} from '@fullcalendar/core';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {VacacionesType} from '@/types';
import {DateUtils, getStatus, hasPermission} from '@/utils';
import {EVENTTYPES, PERMISOS_MAP_IDS} from '@/constants';

export default function useVacaciones() {
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesListener} = useGetEmployees();

  const canAprobarVacaciones = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.aprobarVacaciones,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  useEffect(() => {
    const unsubscribe = getEmployeesListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getEmployeesListener]);

  const getApprovalIndicator = (canIApproveIt: boolean, aprobadas: boolean | null, isMyVacations: boolean): string => {
    if (canIApproveIt) return '🟢';
    if (aprobadas !== null) return '';
    if (isMyVacations) return '';
    return '⚫';
  };

  const createEvent = useCallback(
    (id: string, email: string, index: number, thisVacaciones: VacacionesType) => {
      const isMyVacations = id === user.id;
      const {rangoFechas, aprobadas, approver} = thisVacaciones;
      const {status, statusCopy} = getStatus(aprobadas, isMyVacations);
      const canIApproveIt = approver === user.id && aprobadas === null;
      const approvalIndicator = getApprovalIndicator(canIApproveIt, aprobadas, isMyVacations);
      return {
        id: `${EVENTTYPES.vacaciones}-${id}-${index}`,
        title: `${isMyVacations ? 'Mis vacaciones' : 'Vacaciones de'} ${email} - ${statusCopy} ${approvalIndicator}`,
        className: status,
        start: DateUtils.parseStringToDate(rangoFechas[0]),
        end: DateUtils.addDays(DateUtils.parseStringToDate(rangoFechas[1]), 1),
        allDay: true,
        durationEditable: false,
        editable: false,
        interactive: false,
        startEditable: false,
        extendedProps: {...{...thisVacaciones, isMyVacations}}
      };
    },
    [user.id]
  );

  const allVacationsEvents: EventInput[] = useMemo(() => {
    if (users!.length <= 0) return [];
    return users.flatMap(({vacaciones, id, email}) =>
      vacaciones.map((thisVacaciones, index) => createEvent(id, email, index, thisVacaciones))
    );
  }, [createEvent, users]);

  const myVacationsOnlyEvents: EventInput[] = useMemo(() => {
    if (users!.length <= 0) return [];
    const myUser = users.find((userItem) => userItem.id === user.id);
    if (myUser) {
      return myUser.vacaciones.map((thisVacaciones, index) => createEvent(user.id, user.email, index, thisVacaciones));
    } else return [];
  }, [createEvent, user.email, user.id, users]);

  const events: EventInput[] = useMemo(() => {
    if (canAprobarVacaciones) return allVacationsEvents;
    return myVacationsOnlyEvents;
  }, [allVacationsEvents, myVacationsOnlyEvents, canAprobarVacaciones]);

  return {
    events,
    users,
    user,
    isLoadingUsers,
    canAprobarVacaciones
  };
}
