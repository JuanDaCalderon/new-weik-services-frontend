import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {DateUtils} from '@/utils';
import {memo, useMemo} from 'react';
import {Row, Col} from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import {EventClickArg, EventDropArg, DateSelectArg, EventInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, DropArg} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';

const Horario = memo(function Horario() {
  const {horario, id} = useAppSelector(selectUser);

  const events: EventInput[] = useMemo(() => {
    if (!horario) return [];
    if (horario.length <= 0) return [];
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
  }, [horario, id]);

  return (
    <Row>
      <Col className="mt-2">
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
  );
});

export {Horario};
