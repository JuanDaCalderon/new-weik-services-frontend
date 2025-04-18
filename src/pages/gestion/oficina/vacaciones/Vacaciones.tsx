import {memo, useEffect, useMemo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {ToastWrapper} from '@/components/Toast';
import {EventInput} from '@fullcalendar/core';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores';
import {DateUtils} from '@/utils';
import {useGetEmployees} from '@/endpoints';
import {CalendarWidget} from '@/components/Calendar';

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
                  <CalendarWidget events={events} />
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
