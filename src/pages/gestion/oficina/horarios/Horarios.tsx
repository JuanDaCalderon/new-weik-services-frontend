import {memo, useState, useEffect, useCallback, useMemo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import FullCalendar from '@fullcalendar/react';
import {EventClickArg, EventDropArg, DateSelectArg, EventInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, DropArg} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';
import {ToastWrapper} from '@/components/Toast';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {Employee} from '@/types';
import {UsersColumnList} from './UsersColumnList';
import {DateUtils} from '@/utils';

const Horarios = memo(function Horarios() {
  const [user, setUser] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  useEffect(() => {
    if (users.length > 0) {
      setUser(users);
      setSelectedUser(users[0]);
    }
  }, [users, users.length]);

  const search = useCallback(
    (text: string) => {
      setUser(
        text
          ? [...users].filter((u) =>
              ['nombres', 'email', 'apellidos', 'userName'].some((key) =>
                (u[key as keyof Employee] || '').toString().toLowerCase().includes(text.toLowerCase())
              )
            )
          : [...users]
      );
    },
    [users]
  );

  const handleUserSelection = (user: Employee) => setSelectedUser(user);

  const events: EventInput[] = useMemo(() => {
    if (!selectedUser) return [];
    if (selectedUser.horario.length <= 0) return [];
    const {horario, id} = selectedUser;
    const eventosHorarios: EventInput[] = [];
    horario.forEach((thisHorario, index) => {
      const {horaInicio, horasDeTrabajo, rangoFechas, break: horarioBreak} = thisHorario;
      eventosHorarios.push({
        id: `horario-${id}-${index}`,
        title: `Hora entrada ${DateUtils.convertTo12HourFormat(horaInicio)} - ${horasDeTrabajo} Horas - ${horarioBreak} Minutos de break`,
        className: 'bg-primary',
        start: DateUtils.parseStringToDate(rangoFechas[0]),
        end: DateUtils.addDays(DateUtils.parseStringToDate(rangoFechas[1]), 1),
        allDay: true,
        durationEditable: false,
        editable: false,
        interactive: false,
        startEditable: false,
        extendedProps: {...thisHorario}
      });
    });
    return eventosHorarios;
  }, [selectedUser]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Horario" />
      <Card>
        <Card.Body>
          <Row>
            <Col xl={2}>
              <UsersColumnList
                users={user}
                isLoadingUsers={isLoadingUsers}
                onUserSelect={handleUserSelection}
                search={search}
                selectedUser={selectedUser}
              />
            </Col>
            <Col xl={10}>
              <div id="calendar">
                <FullCalendar
                  locale={'es'}
                  initialView="dayGridMonth"
                  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, BootstrapTheme]}
                  themeSystem="bootstrap"
                  buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    list: 'Lista',
                    prev: 'Anterior',
                    next: 'Siguiente'
                  }}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                  }}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  handleWindowResize={true}
                  droppable={true}
                  weekends={true}
                  eventDurationEditable={true}
                  eventStartEditable={true}
                  eventResizableFromStart={true}
                  eventInteractive={true}
                  events={events}
                  dateClick={(arg: DateClickArg) => console.log('dateClick', arg)}
                  eventClick={(arg: EventClickArg) => console.log('eventClick', arg)}
                  drop={(arg: DropArg) => console.log('drop', arg)}
                  eventDrop={(arg: EventDropArg) => console.log('eventDrop', arg)}
                  select={(arg: DateSelectArg) => console.log('select', arg)}
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </ToastWrapper>
  );
});

export {Horarios};
