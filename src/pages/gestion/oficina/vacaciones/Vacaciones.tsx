import {memo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {TOAST_DURATION} from '@/constants';
import {Toaster} from 'react-hot-toast';
import FullCalendar from '@fullcalendar/react';
import {EventClickArg, EventDropArg} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, DropArg} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';

const Vacaciones = memo(function Vacaciones() {
  return (
    <>
      <PageBreadcrumb title="Horario" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col xl={12}>
                  <div id="calendar">
                    <FullCalendar
                      initialView="dayGridMonth"
                      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, BootstrapTheme]}
                      handleWindowResize={true}
                      themeSystem="bootstrap"
                      buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                        list: 'List',
                        prev: 'Prev',
                        next: 'Next'
                      }}
                      headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                      }}
                      editable={true}
                      selectable={true}
                      droppable={true}
                      events={[]}
                      dateClick={(arg: DateClickArg) => console.log(arg)}
                      eventClick={(arg: EventClickArg) => console.log(arg)}
                      drop={(arg: DropArg) => console.log(arg)}
                      eventDrop={(arg: EventDropArg) => console.log(arg)}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: TOAST_DURATION,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
});

export {Vacaciones};
