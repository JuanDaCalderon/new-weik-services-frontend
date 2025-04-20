import {useEffect, useMemo} from 'react';
import {EventInput} from '@fullcalendar/core';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {VacacionesType} from '@/types';
import {DateUtils, getStatus} from '@/utils';
import {EVENTTYPES} from '@/constants';

export default function useVacaciones() {
  const user = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  const events: EventInput[] = useMemo(() => {
    if (users!.length <= 0) return [];
    const createEvent = (id: string, email: string, index: number, thisVacaciones: VacacionesType) => {
      const isMyVacations = id === user.id;
      const {rangoFechas, aprobadas, approver} = thisVacaciones;
      const {status, statusCopy} = getStatus(aprobadas, isMyVacations);
      const canIApproveIt = approver === user.id && aprobadas === null;
      return {
        id: `${EVENTTYPES.vacaciones}-${id}-${index}`,
        title: `${isMyVacations ? 'Mis vacaciones' : 'Vacaciones de'} ${email} - ${statusCopy} ${canIApproveIt ? '🟢' : '⚫'}`,
        className: status,
        start: DateUtils.parseStringToDate(rangoFechas[0]),
        end: DateUtils.addDays(DateUtils.parseStringToDate(rangoFechas[1]), 1),
        allDay: true,
        durationEditable: false,
        editable: false,
        interactive: false,
        startEditable: false,
        extendedProps: {...thisVacaciones}
      };
    };
    return users.flatMap(({vacaciones, id, email}) =>
      vacaciones.map((thisVacaciones, index) => createEvent(id, email, index, thisVacaciones))
    );
  }, [user.id, users]);

  return {
    events,
    users,
    user,
    isLoadingUsers,
    getEmployeesSync
  };
}
