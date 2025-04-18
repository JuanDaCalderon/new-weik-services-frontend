import {memo} from 'react';
import FullCalendar from '@fullcalendar/react';
import {EventClickArg, EventDropArg, DateSelectArg, EventInput} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, DropArg} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';

type CalendarWidgetProps = {
  onDateClick?: (arg: DateClickArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
  onEventDrop?: (value: EventDropArg) => void;
  onDrop?: (arg: DropArg) => void;
  onSelect?: (arg: DateSelectArg) => void;
  events: Array<EventInput>;
};

const CalendarWidget = memo(function CalendarWidget({
  events,
  onDateClick = (arg: DateClickArg) => console.log('dateClick', arg),
  onEventClick = (arg: EventClickArg) => console.log('eventClick', arg),
  onEventDrop = (arg: EventDropArg) => console.log('eventDrop', arg),
  onDrop = (arg: DropArg) => console.log('drop', arg),
  onSelect = (arg: DateSelectArg) => console.log('select', arg)
}: CalendarWidgetProps) {
  return (
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
        dateClick={onDateClick}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
        drop={onDrop}
        select={onSelect}
      />
    </div>
  );
});

export {CalendarWidget};
