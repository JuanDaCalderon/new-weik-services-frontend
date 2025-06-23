import {useCallback, useEffect, useMemo, useState, ChangeEvent} from 'react';
import {EventInput} from '@fullcalendar/core';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {VacacionesType} from '@/types';
import {DateUtils, getStatus, hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';

export default function useVacaciones() {
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();
  const [isCheckedOnlyMyVacations, setIsCheckedOnlyMyVacations] = useState<boolean>(false);
  const [isCheckedPendingVacations, setisCheckedPendingVacations] = useState<boolean>(false);

  const handleSwitchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIsCheckedOnlyMyVacations(e.target.checked);
  }, []);

  const handleSwitchChangePendingVacations = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setisCheckedPendingVacations(e.target.checked);
    setIsCheckedOnlyMyVacations(false);
  }, []);

  const canAprobarVacaciones = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.aprobarVacaciones,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  const getApprovalIndicator = (canIApproveIt: boolean, aprobadas: boolean | null, isMyVacations: boolean): string => {
    if (canIApproveIt) return '🟢';
    if (aprobadas !== null) return '';
    if (isMyVacations) return '';
    return '⚫';
  };

  const createEvent = useCallback(
    (id: string, email: string, index: number, thisVacaciones: VacacionesType): EventInput => {
      const isMyVacations = id === user.id;
      const {rangoFechas, aprobadas, approver} = thisVacaciones;
      const {status, statusCopy} = getStatus(aprobadas, isMyVacations);
      const canIApproveIt = approver === user.id && aprobadas === null;
      const approvalIndicator = getApprovalIndicator(canIApproveIt, aprobadas, isMyVacations);
      return {
        id: `vacaciones-${id}-${index}`,
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
    if (isCheckedOnlyMyVacations) {
      return myVacationsOnlyEvents;
    }
    if (isCheckedPendingVacations) {
      return allVacationsEvents.filter((event) => {
        const {aprobadas} = event.extendedProps as VacacionesType;
        return aprobadas === null;
      });
    }
    return allVacationsEvents;
  }, [allVacationsEvents, isCheckedOnlyMyVacations, isCheckedPendingVacations, myVacationsOnlyEvents]);

  return {
    events,
    users,
    user,
    isLoadingUsers,
    canAprobarVacaciones,
    handleSwitchChange,
    handleSwitchChangePendingVacations,
    getEmployeesSync,
    isCheckedOnlyMyVacations,
    isCheckedPendingVacations
  };
}
