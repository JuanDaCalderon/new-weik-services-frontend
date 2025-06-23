import {memo, useState, useCallback, useMemo, JSX, ChangeEvent} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {DatepickerRange, GenericModal, PageBreadcrumb} from '@/components';
import {DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import {ToastWrapper} from '@/components/Toast';
import {useAddEventos, useDeleteEventos, useUpdateEventos} from '@/endpoints';
import {calendarEventoEventType, Eventos} from '@/types';
import {areStringArraysEqual, DateUtils, hasPermission} from '@/utils';
import {CalendarWidget} from '@/components/Calendar';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useDatePicker, useTogglev2} from '@/hooks';
import {FormWrapper, InputField, OnlyLabel} from '@/components/Form2';
import {HOME_ROUTER_PATH, PERMISOS_MAP_IDS} from '@/constants';
import toast from 'react-hot-toast';
import {EVENTOSINITIALVALUES} from './initialValues';
import {Navigate} from 'react-router-dom';
import useEventos from './hooks/useEventos';

const EventosCalendar = memo(function EventosCalendar() {
  const [thisEventoEvent, setThisEventoEvent] = useState<calendarEventoEventType>();
  const {dateRange, onDateChangeRange} = useDatePicker();
  const [eventoCreated, setEventoCreated] = useState<Eventos>(EVENTOSINITIALVALUES);
  const {addEvento, isSavingEvento} = useAddEventos();
  const {deleteEvento, isDeletingEvento} = useDeleteEventos();
  const {updateEvento, isUpdatingTheEvento} = useUpdateEventos();
  const {
    thisUserActive,
    eventos,
    isLoadingEventos,
    getEventosSync,
    canCrearEventos,
    canEditarEventos,
    canEliminarEventos
  } = useEventos();
  const {isOpen: isOpenAdd, toggle: toggleAdd, hide: hideAdd} = useTogglev2(false);
  const {isOpen: isOpenEdit, toggle: toggleEdit, hide: hideEdit} = useTogglev2(false);

  const events: EventInput[] = useMemo(() => {
    const createEventInput = (
      id: string,
      title: string,
      start: Date,
      end: Date,
      className: string,
      extendedProps: any
    ): EventInput => ({
      id,
      title,
      className,
      start,
      end,
      allDay: true,
      durationEditable: false,
      editable: false,
      interactive: false,
      startEditable: false,
      extendedProps
    });
    return eventos.map((e, index) => {
      const start = DateUtils.parseStringToDate(e.rangoFechas[0]);
      const end = DateUtils.addDays(DateUtils.parseStringToDate(e.rangoFechas[1]), 1);
      const title = `${e.titulo} - ${e.descripcion}`;
      return createEventInput(`evento-${e.id}-${index}`, title, start, end, 'bg-secondary', e);
    });
  }, [eventos]);

  const onSelectSet = useCallback(
    (arg: DateSelectArg) => {
      const {end, start} = arg;
      onDateChangeRange([start, DateUtils.addDays(end, -1)]);
      if (canCrearEventos) toggleAdd();
    },
    [canCrearEventos, onDateChangeRange, toggleAdd]
  );

  const onEventClickSet = useCallback(
    (arg: EventClickArg) => {
      const {event} = arg;
      const {id, extendedProps, start, end} = event;
      const thisId = id.split('-')[1];
      setThisEventoEvent({id: thisId, evento: extendedProps as Eventos});
      onDateChangeRange([start ?? new Date(), DateUtils.addDays(end ?? new Date(), -1)]);
      if (canEditarEventos || canEliminarEventos) toggleEdit();
    },
    [canEditarEventos, canEliminarEventos, onDateChangeRange, toggleEdit]
  );

  const onDateRangeChange = useCallback((date: Date) => onDateChangeRange(date), [onDateChangeRange]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setEventoCreated((prev) => ({...prev, [name]: value}));
  }, []);

  const handleInputChangeEdit = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setThisEventoEvent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        evento: {
          ...prev.evento,
          [name]: value
        }
      };
    });
  }, []);

  const addModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        <InputField
          xs={12}
          label="Titulo"
          name="titulo"
          type="text"
          value={eventoCreated.titulo}
          onChange={handleInputChange}
        />
        <InputField
          xs={12}
          label="Descripción"
          name="descripcion"
          as="textarea"
          type="text"
          value={eventoCreated.descripcion}
          onChange={handleInputChange}
        />
        <OnlyLabel label="Rango de fechas de duración" xs={12}>
          <DatepickerRange
            dateFormat="MMMM d, yyyy"
            isRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={onDateRangeChange}
          />
        </OnlyLabel>
      </FormWrapper>
    ),
    [dateRange, eventoCreated.descripcion, eventoCreated.titulo, handleInputChange, onDateRangeChange]
  );

  const editModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        <InputField
          xs={12}
          label="Titulo"
          name="titulo"
          type="text"
          value={thisEventoEvent?.evento.titulo}
          onChange={handleInputChangeEdit}
        />
        <InputField
          xs={12}
          label="Descripción"
          name="descripcion"
          as="textarea"
          type="text"
          value={thisEventoEvent?.evento.descripcion}
          onChange={handleInputChangeEdit}
        />
        <OnlyLabel label="Rango de fechas de duración" xs={12}>
          <DatepickerRange
            dateFormat="MMMM d, yyyy"
            isRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={onDateRangeChange}
          />
        </OnlyLabel>
      </FormWrapper>
    ),
    [
      dateRange,
      handleInputChangeEdit,
      onDateRangeChange,
      thisEventoEvent?.evento.descripcion,
      thisEventoEvent?.evento.titulo
    ]
  );

  const onCreateEvent = useCallback(async () => {
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];
    const evento: Partial<Eventos> = {
      descripcion: eventoCreated.descripcion ?? '',
      titulo: eventoCreated.titulo ?? '',
      rangoFechas: dateRangeFormatted
    };
    await addEvento(evento as Eventos);
    hideAdd();
    await getEventosSync();
  }, [addEvento, dateRange, eventoCreated.descripcion, eventoCreated.titulo, getEventosSync, hideAdd]);

  const onEditEvent = useCallback(async () => {
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];
    if (thisEventoEvent) {
      let newEventUpdated: Partial<Eventos> = {
        ...thisEventoEvent.evento
      };
      delete newEventUpdated.id;
      if (!areStringArraysEqual(thisEventoEvent.evento.rangoFechas, dateRangeFormatted)) {
        newEventUpdated.rangoFechas = dateRangeFormatted;
      } else delete newEventUpdated.rangoFechas;
      await updateEvento(thisEventoEvent.id, newEventUpdated);
      hideEdit();
      await getEventosSync();
    }
  }, [dateRange, getEventosSync, hideEdit, thisEventoEvent, updateEvento]);

  const onDeleteEvent = useCallback(async () => {
    if (thisEventoEvent) {
      await deleteEvento(thisEventoEvent.id);
      hideEdit();
      await getEventosSync();
    }
  }, [deleteEvento, getEventosSync, hideEdit, thisEventoEvent]);

  if (
    !hasPermission(
      PERMISOS_MAP_IDS.accesoEventos,
      thisUserActive.roles,
      thisUserActive.permisosOtorgados,
      thisUserActive.permisosDenegados
    )
  ) {
    return <Navigate to={HOME_ROUTER_PATH} replace />;
  }

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Eventos" />
      <Card>
        <Card.Body>
          <Row>
            <Col xl={2}>
              <h5 className="text-center">¿Cómo funciona?</h5>
              <ul className="ps-3">
                <li className="text-muted mb-1 font-14">
                  Selecciona las fechas en el calendario y ajusta el rango arrastrando y soltando según sea necesario.
                </li>
                <li className="text-muted mb-1 font-14">Podrás crear eventos generales visibles para todos.</li>
              </ul>
            </Col>
            <Col xl={10}>
              {isLoadingEventos ? (
                <SkeletonLoader customClass="p-0" height="66vh" />
              ) : (
                <CalendarWidget events={events} onSelect={onSelectSet} onEventClick={onEventClickSet} />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <GenericModal
        show={isOpenAdd}
        onToggle={toggleAdd}
        headerText="Crear nuevo evento"
        submitText="Crear"
        body={addModalBody}
        isDisabled={isSavingEvento}
        isLoading={isSavingEvento}
        onSend={onCreateEvent}
      />
      <GenericModal
        show={isOpenEdit}
        onToggle={toggleEdit}
        showDeleteButton={canEliminarEventos}
        headerText="Editar evento"
        isDisabled={!canEditarEventos || isDeletingEvento || isUpdatingTheEvento}
        isLoading={isDeletingEvento || isUpdatingTheEvento}
        body={editModalBody}
        onSend={onEditEvent}
        onDelete={onDeleteEvent}
      />
    </ToastWrapper>
  );
});

export {EventosCalendar};
