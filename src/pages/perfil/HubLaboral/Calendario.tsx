import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {DateUtils} from '@/utils';
import {memo, useMemo} from 'react';
import {Row, Col} from 'react-bootstrap';
import {EventInput} from '@fullcalendar/core';
import {CalendarWidget} from '@/components/Calendar';

const Calendario = memo(function Calendario() {
  const {horario, vacaciones, id} = useAppSelector(selectUser);

  const horarioEvents: EventInput[] = useMemo(() => {
    if (!horario || horario.length === 0) return [];
    return horario.map((item, index) => {
      const {horaInicio, horasDeTrabajo, rangoFechas, break: horarioBreak} = item;
      return {
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
        extendedProps: {...item}
      };
    });
  }, [horario, id]);

  const vacacionesEvents: EventInput[] = useMemo(() => {
    if (!vacaciones || vacaciones.length === 0) return [];
    return vacaciones.map((item, index) => {
      const {rangoFechas, aprobadas} = item;
      let status = 'bg-secondary';
      let statusCopy = 'Pendiente';
      if (aprobadas === true) {
        status = 'bg-success';
        statusCopy = 'Aprobadas';
      } else if (aprobadas === false) {
        status = 'bg-danger';
        statusCopy = 'Denegadas';
      }
      return {
        id: `vacacion-${id}-${index}`,
        title: `Mis vacaciones - ${statusCopy}`,
        className: status,
        start: DateUtils.parseStringToDate(rangoFechas[0]),
        end: DateUtils.addDays(DateUtils.parseStringToDate(rangoFechas[1]), 1),
        allDay: true,
        durationEditable: false,
        editable: false,
        interactive: false,
        startEditable: false,
        extendedProps: {...item}
      };
    });
  }, [id, vacaciones]);

  const events: EventInput[] = useMemo(
    () => [...horarioEvents, ...vacacionesEvents],
    [horarioEvents, vacacionesEvents]
  );

  return (
    <Row>
      <Col>
        <CalendarWidget events={events} />
      </Col>
    </Row>
  );
});

export {Calendario};
