import {useEffect, useMemo} from 'react';
import {EventInput} from '@fullcalendar/core';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {VacacionesType} from '@/types';
import {DateUtils, getStatus} from '@/utils';
import {EVENTTYPES} from '@/constants';

export default function useVacaciones() {
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  const events: EventInput[] = useMemo(() => {
    if (users!.length <= 0) return [];
    const createEvent = (id: string, email: string, index: number, thisVacaciones: VacacionesType) => {
      const {rangoFechas, aprobadas} = thisVacaciones;
      const {status, statusCopy} = getStatus(aprobadas);
      return {
        id: `${EVENTTYPES.vacaciones}-${id}-${index}`,
        title: `Vacaciones de ${email} - ${statusCopy}`,
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
  }, [users]);

  return {
    events,
    users,
    isLoadingUsers,
    getEmployeesSync
  };
}
