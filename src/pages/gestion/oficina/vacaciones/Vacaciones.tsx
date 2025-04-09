import {memo, useEffect, useMemo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {ToastWrapper} from '@/components/Toast';
import FullCalendar from '@fullcalendar/react';
import {EventClickArg, EventDropArg, DateSelectArg, EventInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, DropArg} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores';
import {DateUtils} from '@/utils';
import {useGetEmployees} from '@/endpoints';

const Vacaciones = memo(function Vacaciones() {
  const users = useAppSelector(selectEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  const events: EventInput[] = useMemo(() => {
    if (users!.length <= 0) return [];
    const eventosVacaciones: EventInput[] = [];
    users.forEach(({vacaciones, id, email}) => {
      vacaciones.forEach((thisVacaciones, index) => {
        const {rangoFechas, aprobadas} = thisVacaciones;
        let status: string = 'bg-secondary';
        let statusCopy: string = 'Pendiente';
        if (aprobadas === true) {
          status = 'bg-success';
          statusCopy = 'Aprobadas';
        }
        if (aprobadas === false) {
          status = 'bg-danger';
          statusCopy = 'Denegadas';
        }
        eventosVacaciones.push({
          id: `horario-${id}-${index}`,
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
        });
      });
    });
    return eventosVacaciones;
  }, [users]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Horario" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col xl={12}>
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
        </Col>
      </Row>
    </ToastWrapper>
  );
});

export {Vacaciones};
