import {memo, useState, useEffect, useCallback, useMemo, JSX, ChangeEvent} from 'react';
import {Card, Col, Form, Image, Row} from 'react-bootstrap';
import {CustomDatePicker, DatepickerRange, GenericModal, PageBreadcrumb} from '@/components';
import {DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import {ToastWrapper} from '@/components/Toast';
import {useAppSelector} from '@/store';
import {selectEmployees, selectEventos, selectisLoadingEmployees, selectIsLoadingEventos} from '@/store/selectores';
import {useGetEmployees, useGetEventos, useAddEventos, useAddHorario, useDeleteEventos} from '@/endpoints';
import {calendarEventoEventType, calendarHorarioEventType, Employee, Eventos, HorarioType} from '@/types';
import {UsersColumnList} from './UsersColumnList';
import {DateUtils, getNombreCompletoUser} from '@/utils';
import {CalendarWidget} from '@/components/Calendar';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useDatePicker, useTogglev2} from '@/hooks';
import {FormWrapper, InputField, SelectField} from '@/components/Form2';
import {BREAKMINUTES, BREAKSOPTIONS, EVENTTYPES, EVENTTYPESOPTIONS} from '@/constants';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import toast from 'react-hot-toast';

const Calendario = memo(function Calendario() {
  const [user, setUser] = useState<Employee[]>([]);
  const [thisHorarioEvent, setThisHorarioEvent] = useState<calendarHorarioEventType | null>(null);
  const [thisEventoEvent, setThisEventoEvent] = useState<calendarEventoEventType | null>(null);
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [eventType, setEventType] = useState<EVENTTYPES>(EVENTTYPES.horario);
  const {dateRange, onDateChangeRange} = useDatePicker();
  const [startTime, setStartTime] = useState<Date>(DateUtils.getFormattedTime() as Date);
  const [eventoCreated, setEventoCreated] = useState<Eventos>({
    titulo: '',
    descripcion: '',
    rangoFechas: []
  });
  const [horarioCreated, setHorarioCreated] = useState<HorarioType>({
    horasDeTrabajo: 8,
    horaInicio: DateUtils.getFormattedTime(false) as string,
    break: +BREAKMINUTES.MIN_30,
    rangoFechas: []
  });
  const users = useAppSelector(selectEmployees);
  const eventos = useAppSelector(selectEventos);
  const isLoadingEventos = useAppSelector(selectIsLoadingEventos);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();
  const {getEventosSync} = useGetEventos();
  const {addEvento, isSavingEvento} = useAddEventos();
  const {addHorario, isLoadingAddHorario} = useAddHorario();
  const {deleteEvento, isDeletingEvento} = useDeleteEventos();
  const {isOpen: isOpenAdd, toggle: toggleAdd, hide: hideAdd} = useTogglev2(false);
  const {isOpen: isOpenEdit, toggle: toggleEdit, hide: hideEdit} = useTogglev2(false);

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  useEffect(() => {
    if (eventos.length <= 0) getEventosSync();
  }, [eventos.length, getEventosSync]);

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

  const userHorarioEvents = useMemo(() => {
    if (!selectedUser) return [];
    if (selectedUser.horario.length <= 0) return [];
    const {horario, id} = selectedUser;
    const eventosHorarios: EventInput[] = [];
    horario.forEach((thisHorario, index) => {
      const {horaInicio, horasDeTrabajo, rangoFechas, break: horarioBreak} = thisHorario;
      eventosHorarios.push({
        id: `${EVENTTYPES.horario}-${id}-${index}`,
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

  const events: EventInput[] = useMemo(() => {
    const events: EventInput[] = [...userHorarioEvents];
    eventos.forEach((event, index) => {
      const {titulo, rangoFechas, id, descripcion} = event;
      events.push({
        id: `${EVENTTYPES.evento}-${id}-${index}`,
        title: `${titulo} - ${descripcion}`,
        className: 'bg-secondary',
        start: DateUtils.parseStringToDate(rangoFechas[0]),
        end: DateUtils.addDays(DateUtils.parseStringToDate(rangoFechas[1]), 1),
        allDay: true,
        durationEditable: false,
        editable: false,
        interactive: false,
        startEditable: false,
        extendedProps: {...event}
      });
    });
    return events;
  }, [eventos, userHorarioEvents]);

  const onSelectSet = useCallback(
    (arg: DateSelectArg) => {
      const {end, start} = arg;
      onDateChangeRange([start, DateUtils.addDays(end, -1)]);
      toggleAdd();
    },
    [onDateChangeRange, toggleAdd]
  );

  const onEventClickSet = useCallback(
    (arg: EventClickArg) => {
      const {event} = arg;
      const {id, extendedProps} = event;
      const eventType = id.split('-')[0];
      const thisId = id.split('-')[1];
      if (eventType === EVENTTYPES.horario) {
        setEventType(EVENTTYPES.horario);
        setThisHorarioEvent({id: thisId, horario: extendedProps as HorarioType});
      }
      if (eventType === EVENTTYPES.evento) {
        setEventType(EVENTTYPES.evento);
        setThisEventoEvent({id: thisId, evento: extendedProps as Eventos});
      }
      toggleEdit();
    },
    [toggleEdit]
  );

  const onDateRangeChange = useCallback((date: Date) => onDateChangeRange(date), [onDateChangeRange]);
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setEventoCreated((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);
  const handleInputChangeHorario = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setHorarioCreated((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);
  const turnoOnChange = useCallback((date: Date) => {
    setStartTime(date);
    setHorarioCreated((prev) => ({
      ...prev,
      horaInicio: DateUtils.getFormattedTime(false, date, date.getHours(), date.getMinutes()) as string
    }));
  }, []);

  const addModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        <SelectField
          options={EVENTTYPESOPTIONS}
          xs={12}
          label="Tipo de evento"
          defaultValue={eventType}
          onChange={(e) => setEventType(e.target.value as EVENTTYPES)}
        />
        <hr />
        {eventType === EVENTTYPES.horario ? (
          <>
            <Col xs={12}>
              <div className="d-flex">
                <div className="position-relative me-2">
                  {!iconHasLoad && <SkeletonLoader customClass="position-absolute top-0 p-0 w-100 h-50" />}
                  <Image
                    loading="lazy"
                    alt=""
                    className="img-thumbnail rounded-circle object-fit-contain"
                    width={190}
                    height={190}
                    style={{aspectRatio: '1/1'}}
                    src={selectedUser?.userImage ? selectedUser?.userImage : fallBackLogo}
                    onLoad={() => setIconHasLoad(true)}
                  />
                </div>

                {selectedUser && (
                  <p>
                    Vas a asignar un horario al usuario{' '}
                    <span className="fw-bold">
                      {getNombreCompletoUser(selectedUser ? selectedUser : ({} as Employee))}
                    </span>
                    , cuyo turno de entrada es a las <span className="fw-bold">{horarioCreated.horaInicio}</span>, con
                    una jornada laboral de <span className="fw-bold">{horarioCreated.horasDeTrabajo}</span> horas, un
                    descanso de <span className="fw-bold">{horarioCreated.break}</span> minutos y un rango de fechas del{' '}
                    <span className="fw-bold">{`${DateUtils.formatShortDate(dateRange[0] ? dateRange[0] : new Date())} - ${DateUtils.formatShortDate(
                      dateRange[1] ? dateRange[1] : new Date()
                    )}`}</span>
                    .
                  </p>
                )}
              </div>
            </Col>
            <InputField
              xs={6}
              label="Horas de trabajo"
              name="horasDeTrabajo"
              type="number"
              value={horarioCreated.horasDeTrabajo}
              onChange={handleInputChangeHorario}
            />
            <SelectField
              options={BREAKSOPTIONS}
              xs={6}
              name="break"
              label="Break en minutos"
              defaultValue={horarioCreated.break.toString()}
              onChange={handleInputChangeHorario}
            />
            <Col xs={12}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="horaInicio" className="mb-1">
                  <strong>Turno de inicio</strong>
                </Form.Label>
                <CustomDatePicker
                  value={startTime}
                  showTimeSelectOnly={true}
                  showTimeSelect={true}
                  timeCaption="Horas"
                  tI={30}
                  dateFormat={'hh:mm aa'}
                  onChange={turnoOnChange}
                />
              </Form.Group>
            </Col>
          </>
        ) : (
          <>
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
          </>
        )}

        <Col xs={12}>
          <Form.Label htmlFor="rangoFechas" className="mb-1">
            <strong>Rango de fechas en el que va a durar esta noticia</strong>
          </Form.Label>
          <DatepickerRange
            dateFormat="MMMM d, yyyy"
            isRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={onDateRangeChange}
          />
        </Col>
      </FormWrapper>
    ),
    [
      dateRange,
      eventType,
      eventoCreated.descripcion,
      eventoCreated.titulo,
      handleInputChange,
      handleInputChangeHorario,
      horarioCreated.break,
      horarioCreated.horaInicio,
      horarioCreated.horasDeTrabajo,
      iconHasLoad,
      onDateRangeChange,
      selectedUser,
      startTime,
      turnoOnChange
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
    if (eventType === EVENTTYPES.evento) {
      const evento: Eventos = {
        descripcion: eventoCreated.descripcion ?? '',
        titulo: eventoCreated.titulo ?? '',
        rangoFechas: dateRangeFormatted
      };
      await addEvento(evento);
      await getEventosSync();
    }
    if (eventType === EVENTTYPES.horario) {
      const horario: HorarioType = {
        horasDeTrabajo: +horarioCreated.horasDeTrabajo,
        horaInicio: horarioCreated.horaInicio,
        break: horarioCreated.break,
        rangoFechas: dateRangeFormatted
      };
      if (selectedUser) {
        const {id} = selectedUser;
        await addHorario(id, selectedUser.horario, horario);
        await getEmployeesSync();
      }
    }
    hideAdd();
  }, [
    addEvento,
    addHorario,
    dateRange,
    eventType,
    eventoCreated.descripcion,
    eventoCreated.titulo,
    getEmployeesSync,
    getEventosSync,
    hideAdd,
    horarioCreated.break,
    horarioCreated.horaInicio,
    horarioCreated.horasDeTrabajo,
    selectedUser
  ]);

  const onEditEvent = useCallback(async () => {
    hideEdit();
  }, [hideEdit]);

  const onDeleteEvent = useCallback(async () => {
    if (eventType === EVENTTYPES.horario) {
      console.log('🚀 ~ Calendario ~ thisHorarioEvent:', thisHorarioEvent);
    }
    if (eventType === EVENTTYPES.evento && thisEventoEvent) {
      await deleteEvento(thisEventoEvent.id);
      await getEventosSync();
    }
    hideEdit();
  }, [deleteEvento, eventType, getEventosSync, hideEdit, thisEventoEvent, thisHorarioEvent]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Calendario" />
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
              {isLoadingEventos || isLoadingUsers ? (
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
        variant={`${eventType === EVENTTYPES.horario ? 'info' : 'dark'}`}
        headerText={`Crear nuevo ${eventType} ${eventType === EVENTTYPES.horario ? `a ${getNombreCompletoUser(selectedUser ? selectedUser : ({} as Employee))}` : ''} `}
        submitText="Crear"
        secondaryText="Cancelar"
        body={addModalBody}
        isDisabled={isSavingEvento || isLoadingAddHorario}
        isLoading={isSavingEvento || isLoadingAddHorario}
        onSend={onCreateEvent}
      />
      <GenericModal
        show={isOpenEdit}
        onToggle={toggleEdit}
        showDeleteButton
        variant={`${eventType === EVENTTYPES.horario ? 'info' : 'dark'}`}
        headerText={`${eventType} ${eventType === EVENTTYPES.horario ? `de ${getNombreCompletoUser(selectedUser ? selectedUser : ({} as Employee))}` : ''} `}
        submitText="Editar"
        secondaryText="Cancelar"
        isDisabled={isDeletingEvento}
        isLoading={isDeletingEvento}
        body={<></>}
        onSend={onEditEvent}
        onDelete={onDeleteEvent}
      />
    </ToastWrapper>
  );
});

export {Calendario};
