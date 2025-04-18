import {memo, useState, useEffect, useCallback, useMemo, JSX, ChangeEvent} from 'react';
import {Card, Col, Form, Image, Row} from 'react-bootstrap';
import {CustomDatePicker, DatepickerRange, GenericModal, PageBreadcrumb} from '@/components';
import {DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import {ToastWrapper} from '@/components/Toast';
import {useAppSelector} from '@/store';
import {selectEmployees, selectEventos, selectisLoadingEmployees, selectIsLoadingEventos} from '@/store/selectores';
import {
  useGetEmployees,
  useGetEventos,
  useAddEventos,
  useAddHorario,
  useDeleteEventos,
  useDeleteHorario,
  useUpdateEventos,
  useUpdateHorario
} from '@/endpoints';
import {calendarEventoEventType, calendarHorarioEventType, Employee, Eventos, HorarioType} from '@/types';
import {UsersColumnList} from './UsersColumnList';
import {areStringArraysEqual, DateUtils, getNombreCompletoUser} from '@/utils';
import {CalendarWidget} from '@/components/Calendar';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useDatePicker, useTogglev2} from '@/hooks';
import {FormWrapper, InputField, SelectField} from '@/components/Form2';
import {BREAKMINUTES, BREAKSOPTIONS, EVENTTYPES, EVENTTYPESOPTIONS} from '@/constants';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import toast from 'react-hot-toast';

const Calendario = memo(function Calendario() {
  const [user, setUser] = useState<Employee[]>([]);
  const [thisHorarioEvent, setThisHorarioEvent] = useState<calendarHorarioEventType>();
  const [thisEventoEvent, setThisEventoEvent] = useState<calendarEventoEventType>();
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [eventType, setEventType] = useState<EVENTTYPES>(EVENTTYPES.horario);
  const {dateRange, onDateChangeRange} = useDatePicker();
  const [startTime, setStartTime] = useState<Date>(DateUtils.getFormattedTime() as Date);
  const [startTimeEdit, setStartTimeEdit] = useState<Date>(DateUtils.getFormattedTime() as Date);
  const [eventoCreated, setEventoCreated] = useState<Eventos>({
    titulo: '',
    descripcion: '',
    rangoFechas: []
  });
  const [horarioCreated, setHorarioCreated] = useState<HorarioType>({
    uuid: '',
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
  const {deleteHorario, isLoadingDeleteHorario} = useDeleteHorario();
  const {updateEvento, isUpdatingTheEvento} = useUpdateEventos();
  const {updateHorario, isLoadingUpdateHorario} = useUpdateHorario();
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
      const {id, extendedProps, start, end} = event;
      const eventType = id.split('-')[0];
      const thisId = id.split('-')[1];
      if (eventType === EVENTTYPES.horario) {
        setEventType(EVENTTYPES.horario);
        setThisHorarioEvent({id: thisId, horario: extendedProps as HorarioType});
        onDateChangeRange([start ?? new Date(), DateUtils.addDays(end ?? new Date(), -1)]);
        setStartTimeEdit(
          DateUtils.getFormattedTime(
            true,
            new Date(),
            +(extendedProps as HorarioType).horaInicio.split(':')[0]!,
            +(extendedProps as HorarioType).horaInicio.split(':')[1]!
          ) as Date
        );
      }
      if (eventType === EVENTTYPES.evento) {
        setEventType(EVENTTYPES.evento);
        setThisEventoEvent({id: thisId, evento: extendedProps as Eventos});
        onDateChangeRange([start ?? new Date(), DateUtils.addDays(end ?? new Date(), -1)]);
      }
      toggleEdit();
    },
    [onDateChangeRange, toggleEdit]
  );

  const onDateRangeChange = useCallback((date: Date) => onDateChangeRange(date), [onDateChangeRange]);
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setEventoCreated((prev) => ({
      ...prev,
      [name]: value
    }));
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
  const handleInputChangeHorario = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setHorarioCreated((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);
  const handleInputChangeHorarioEdit = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setThisHorarioEvent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        horario: {
          ...prev.horario,
          [name]: value
        }
      };
    });
  }, []);
  const turnoOnChange = useCallback((date: Date) => {
    setStartTime(date);
    setHorarioCreated((prev) => ({
      ...prev,
      horaInicio: DateUtils.getFormattedTime(false, date, date.getHours(), date.getMinutes()) as string
    }));
  }, []);
  const turnoOnChangeEdit = useCallback((date: Date) => {
    setStartTimeEdit(date);
    setThisHorarioEvent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        horario: {
          ...prev.horario,
          horaInicio: DateUtils.getFormattedTime(false, date, date.getHours(), date.getMinutes()) as string
        }
      };
    });
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
        {eventType === EVENTTYPES.horario && (
          <SelectField
            options={user.map((u) => ({value: u.id, label: getNombreCompletoUser(u)}))}
            xs={12}
            label="Cambiar de usuario"
            onChange={(e) => {
              const userId = e.target.value;
              const userSelected = users.find((u) => u.id === userId);
              setSelectedUser(userSelected ? userSelected : null);
            }}
          />
        )}
        <hr />
        {eventType === EVENTTYPES.horario ? (
          <>
            <Col xs={12}>
              <div className="d-flex">
                <div className="position-relative me-2">
                  <Image
                    loading="lazy"
                    alt=""
                    className="img-thumbnail rounded-circle object-fit-contain"
                    width={190}
                    height={190}
                    style={{aspectRatio: '1/1'}}
                    src={selectedUser?.userImage ? selectedUser?.userImage : fallBackLogo}
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
            <strong>Rango de fechas de duración</strong>
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
      onDateRangeChange,
      selectedUser,
      startTime,
      turnoOnChange,
      user,
      users
    ]
  );

  const editModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        {eventType === EVENTTYPES.horario ? (
          <>
            <Col xs={12}>
              <div className="d-flex">
                <div className="position-relative me-2">
                  <Image
                    loading="lazy"
                    alt=""
                    className="img-thumbnail rounded-circle object-fit-contain"
                    width={190}
                    height={190}
                    style={{aspectRatio: '1/1'}}
                    src={selectedUser?.userImage ? selectedUser?.userImage : fallBackLogo}
                  />
                </div>
                {selectedUser && (
                  <p>
                    Vas a actualizar un horario al usuario{' '}
                    <span className="fw-bold">
                      {getNombreCompletoUser(selectedUser ? selectedUser : ({} as Employee))}
                    </span>
                    , a un turno de entrada a las{' '}
                    <span className="fw-bold">{thisHorarioEvent?.horario.horaInicio}</span>, con una jornada laboral de{' '}
                    <span className="fw-bold">{thisHorarioEvent?.horario.horasDeTrabajo}</span> horas, un descanso de{' '}
                    <span className="fw-bold">{thisHorarioEvent?.horario.break}</span> minutos y un rango de fechas del{' '}
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
              value={thisHorarioEvent?.horario.horasDeTrabajo}
              onChange={handleInputChangeHorarioEdit}
            />
            <SelectField
              options={BREAKSOPTIONS}
              xs={6}
              name="break"
              label="Break en minutos"
              defaultValue={thisHorarioEvent?.horario.break.toString()}
              onChange={handleInputChangeHorarioEdit}
            />
            <Col xs={12}>
              <Form.Group className="mb-2">
                <Form.Label htmlFor="horaInicio" className="mb-1">
                  <strong>Turno de inicio</strong>
                </Form.Label>
                <CustomDatePicker
                  value={startTimeEdit}
                  showTimeSelectOnly={true}
                  showTimeSelect={true}
                  timeCaption="Horas"
                  tI={30}
                  dateFormat={'hh:mm aa'}
                  onChange={turnoOnChangeEdit}
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
          </>
        )}
        <Col xs={12}>
          <Form.Label htmlFor="rangoFechas" className="mb-1">
            <strong>Rango de fechas de duración</strong>
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
      handleInputChangeEdit,
      handleInputChangeHorarioEdit,
      onDateRangeChange,
      selectedUser,
      startTimeEdit,
      thisEventoEvent?.evento.descripcion,
      thisEventoEvent?.evento.titulo,
      thisHorarioEvent?.horario.break,
      thisHorarioEvent?.horario.horaInicio,
      thisHorarioEvent?.horario.horasDeTrabajo,
      turnoOnChangeEdit
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
      hideAdd();
      await getEventosSync();
    }
    if (eventType === EVENTTYPES.horario) {
      const horario: HorarioType = {
        uuid: '',
        horasDeTrabajo: +horarioCreated.horasDeTrabajo,
        horaInicio: horarioCreated.horaInicio,
        break: horarioCreated.break,
        rangoFechas: dateRangeFormatted
      };
      if (selectedUser) {
        const {id} = selectedUser;
        await addHorario(id, horario);
        hideAdd();
        await getEmployeesSync();
      }
    }
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
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];

    if (eventType === EVENTTYPES.evento && thisEventoEvent) {
      let newEventUpdated: Partial<Eventos> = {
        ...thisEventoEvent.evento
      };
      if (!areStringArraysEqual(thisEventoEvent.evento.rangoFechas, dateRangeFormatted)) {
        newEventUpdated.rangoFechas = dateRangeFormatted;
      } else delete newEventUpdated.rangoFechas;
      await updateEvento(thisEventoEvent.id, newEventUpdated);
      hideEdit();
      await getEventosSync();
    }
    if (eventType === EVENTTYPES.horario && thisHorarioEvent) {
      let newHorarioUpdated: Partial<HorarioType> = {
        ...thisHorarioEvent.horario
      };
      if (!areStringArraysEqual(thisHorarioEvent.horario.rangoFechas, dateRangeFormatted)) {
        newHorarioUpdated.rangoFechas = dateRangeFormatted;
      } else delete newHorarioUpdated.rangoFechas;
      delete newHorarioUpdated.uuid;
      if (selectedUser) {
        const {id} = selectedUser;
        await updateHorario(id, thisHorarioEvent.horario.uuid, newHorarioUpdated);
        hideEdit();
        await getEmployeesSync();
      }
      hideEdit();
    }
  }, [
    dateRange,
    eventType,
    getEmployeesSync,
    getEventosSync,
    hideEdit,
    selectedUser,
    thisEventoEvent,
    thisHorarioEvent,
    updateEvento,
    updateHorario
  ]);

  const onDeleteEvent = useCallback(async () => {
    if (eventType === EVENTTYPES.horario && thisHorarioEvent && selectedUser) {
      await deleteHorario(selectedUser.id, thisHorarioEvent.horario.uuid);
      hideEdit();
      await getEmployeesSync();
    }
    if (eventType === EVENTTYPES.evento && thisEventoEvent) {
      await deleteEvento(thisEventoEvent.id);
      hideEdit();
      await getEventosSync();
    }
  }, [
    deleteEvento,
    deleteHorario,
    eventType,
    getEmployeesSync,
    getEventosSync,
    hideEdit,
    selectedUser,
    thisEventoEvent,
    thisHorarioEvent
  ]);

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
        isDisabled={isDeletingEvento || isLoadingDeleteHorario || isUpdatingTheEvento || isLoadingUpdateHorario}
        isLoading={isDeletingEvento || isLoadingDeleteHorario || isUpdatingTheEvento || isLoadingUpdateHorario}
        body={editModalBody}
        onSend={onEditEvent}
        onDelete={onDeleteEvent}
      />
    </ToastWrapper>
  );
});

export {Calendario};
