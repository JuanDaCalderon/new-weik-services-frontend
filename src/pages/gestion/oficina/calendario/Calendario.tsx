import {memo, useState, useEffect, useCallback, useMemo, JSX, ChangeEvent} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {CustomDatePicker, DatepickerRange, GenericModal, PageBreadcrumb} from '@/components';
import {DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import {ToastWrapper} from '@/components/Toast';
import {
  useAddEventos,
  useAddHorario,
  useDeleteEventos,
  useDeleteHorario,
  useUpdateEventos,
  useUpdateHorario
} from '@/endpoints';
import {calendarEventoEventType, calendarHorarioEventType, Employee, Eventos, HorarioType, Option} from '@/types';
import {UsersColumnList} from '@/components';
import {
  areStringArraysEqual,
  DateUtils,
  filterUsers,
  getNombreCompletoUser,
  hasPermission,
  SessionStorageUtil
} from '@/utils';
import {CalendarWidget} from '@/components/Calendar';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useDatePicker, useTogglev2} from '@/hooks';
import {FormWrapper, InputField, OnlyLabel, SelectField} from '@/components/Form2';
import {
  BREAKSOPTIONS,
  DEFAULT_HOME_ROUTER_PATH,
  EVENTTYPES,
  EVENTTYPESOPTIONS,
  PERMISOS_MAP_IDS,
  SESSIONSTORAGE_CALENDAR_USER_SELECTED_KEY
} from '@/constants';
import toast from 'react-hot-toast';
import {HeaderCalendarModals} from './HeaderCalendarModals';
import {EVENTOSINITIALVALUES, HORARIOCREATEDVALUES} from './initialValues';
import {Navigate} from 'react-router-dom';
import useCalendario from './hooks/useCalendario';

const Calendario = memo(function Calendario() {
  const [usersFiltered, setusersFiltered] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [thisHorarioEvent, setThisHorarioEvent] = useState<calendarHorarioEventType>();
  const [thisEventoEvent, setThisEventoEvent] = useState<calendarEventoEventType>();
  const [eventType, setEventType] = useState<EVENTTYPES | null>(EVENTTYPES.horario);
  const {dateRange, onDateChangeRange} = useDatePicker();
  const [startTime, setStartTime] = useState<Date>(DateUtils.getFormattedTime() as Date);
  const [startTimeEdit, setStartTimeEdit] = useState<Date>(DateUtils.getFormattedTime() as Date);
  const [eventoCreated, setEventoCreated] = useState<Eventos>(EVENTOSINITIALVALUES);
  const [horarioCreated, setHorarioCreated] = useState<HorarioType>(HORARIOCREATEDVALUES);
  const {addEvento, isSavingEvento} = useAddEventos();
  const {addHorario, isLoadingAddHorario} = useAddHorario();
  const {deleteEvento, isDeletingEvento} = useDeleteEventos();
  const {deleteHorario, isLoadingDeleteHorario} = useDeleteHorario();
  const {updateEvento, isUpdatingTheEvento} = useUpdateEventos();
  const {updateHorario, isLoadingUpdateHorario} = useUpdateHorario();
  const {
    thisUserActive,
    users,
    eventos,
    isLoadingEventos,
    isLoadingUsers,
    getEmployeesSync,
    getEventosSync,
    canAccesoHorarios,
    canCrearEventos,
    canCrearHorarios,
    canEditarEventos,
    canEditarHorarios,
    canEliminarEventos,
    canEliminarHorarios
  } = useCalendario();
  const {isOpen: isOpenAdd, toggle: toggleAdd, hide: hideAdd} = useTogglev2(false);
  const {isOpen: isOpenEdit, toggle: toggleEdit, hide: hideEdit} = useTogglev2(false);

  useEffect(() => {
    if (users.length > 0) setusersFiltered(users);
  }, [users]);

  useEffect(() => {
    const hasLoadUsers = users.length > 0;
    if (hasLoadUsers) {
      const selectedUserId = SessionStorageUtil.getItem<string>(SESSIONSTORAGE_CALENDAR_USER_SELECTED_KEY);
      const userFound = users.find((u) => u.id === selectedUserId);
      setSelectedUser(userFound ? userFound : users[0]);
    }
  }, [users]);

  const search = useCallback((text: string) => setusersFiltered(filterUsers(users, text)), [users]);

  const handleUserSelection = (u: Employee) => {
    setSelectedUser(u);
    SessionStorageUtil.setItem(SESSIONSTORAGE_CALENDAR_USER_SELECTED_KEY, u.id);
  };

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
    const horarioEvents: EventInput[] =
      selectedUser && selectedUser.horario.length > 0
        ? selectedUser.horario.map((h, index) => {
            const start = DateUtils.parseStringToDate(h.rangoFechas[0]);
            const end = DateUtils.addDays(DateUtils.parseStringToDate(h.rangoFechas[1]), 1);
            const title = `Hora entrada ${DateUtils.convertTo12HourFormat(h.horaInicio)} - ${h.horasDeTrabajo} Horas - ${h.break} Minutos de break`;
            return createEventInput(
              `${EVENTTYPES.horario}-${selectedUser.id}-${index}`,
              title,
              start,
              end,
              'bg-primary',
              h
            );
          })
        : [];
    const eventoEvents: EventInput[] = eventos.map((e, index) => {
      const start = DateUtils.parseStringToDate(e.rangoFechas[0]);
      const end = DateUtils.addDays(DateUtils.parseStringToDate(e.rangoFechas[1]), 1);
      const title = `${e.titulo} - ${e.descripcion}`;
      return createEventInput(`${EVENTTYPES.evento}-${e.id}-${index}`, title, start, end, 'bg-secondary', e);
    });
    return [...horarioEvents, ...eventoEvents];
  }, [eventos, selectedUser]);

  const onSelectSet = useCallback(
    (arg: DateSelectArg) => {
      const {end, start} = arg;
      onDateChangeRange([start, DateUtils.addDays(end, -1)]);
      if (!canCrearHorarios) setEventType(EVENTTYPES.evento);
      if (!canCrearEventos) setEventType(EVENTTYPES.horario);
      if (!canCrearHorarios && !canCrearEventos) setEventType(null);
      if (canCrearHorarios || canCrearEventos) toggleAdd();
    },
    [canCrearEventos, canCrearHorarios, onDateChangeRange, toggleAdd]
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
      if (canEditarHorarios || canEditarEventos || canEliminarHorarios || canEliminarEventos) toggleEdit();
    },
    [canEditarEventos, canEditarHorarios, canEliminarEventos, canEliminarHorarios, onDateChangeRange, toggleEdit]
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

  const eventTypeOptions: Option[] = useMemo(() => {
    if (canCrearHorarios && canCrearEventos) return EVENTTYPESOPTIONS;
    if (canCrearHorarios) return EVENTTYPESOPTIONS.filter((e) => e.value === EVENTTYPES.horario);
    if (canCrearEventos) return EVENTTYPESOPTIONS.filter((e) => e.value === EVENTTYPES.evento);
    return [];
  }, [canCrearEventos, canCrearHorarios]);

  const canCreateHorarioButCannotAccess: boolean = useMemo(() => {
    return eventType === EVENTTYPES.horario && canCrearHorarios && !canAccesoHorarios;
  }, [canAccesoHorarios, canCrearHorarios, eventType]);

  const addModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        <SelectField
          options={eventTypeOptions}
          xs={12}
          label="Tipo de evento"
          defaultValue={eventType ? eventType : undefined}
          onChange={(e) => setEventType(e.target.value as EVENTTYPES)}
        />
        {eventType === EVENTTYPES.horario && (
          <SelectField
            options={usersFiltered.map((u) => ({value: u.id, label: getNombreCompletoUser(u)}))}
            xs={12}
            label="Cambiar de usuario"
            defaultValue={selectedUser ? selectedUser.id : undefined}
            onChange={(e) => {
              const userId = e.target.value;
              const userSelected = users.find((u) => u.id === userId);
              setSelectedUser(userSelected ? userSelected : null);
            }}
          />
        )}
        <hr />
        {eventType === EVENTTYPES.horario && (
          <>
            <HeaderCalendarModals selectedUser={selectedUser} dateRange={dateRange} horarioEvent={horarioCreated} />
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
            <OnlyLabel label="Turno de inicio" xs={12}>
              <CustomDatePicker
                value={startTime}
                showTimeSelectOnly={true}
                showTimeSelect={true}
                timeCaption="Horas"
                tI={30}
                dateFormat={'hh:mm aa'}
                onChange={turnoOnChange}
              />
            </OnlyLabel>
          </>
        )}
        {eventType === EVENTTYPES.evento && (
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
        <OnlyLabel label="Rango de fechas de duración" xs={12}>
          <DatepickerRange
            dateFormat="MMMM d, yyyy"
            isRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={onDateRangeChange}
          />
        </OnlyLabel>
        {canCreateHorarioButCannotAccess && (
          <p className="text-danger m-0">
            Tienes el permiso para crear horarios, pero no tienes acceso a los horarios de los usuarios. Por lo tanto,
            no podrás asignar horarios a los usuarios.
          </p>
        )}
      </FormWrapper>
    ),
    [
      canCreateHorarioButCannotAccess,
      dateRange,
      eventType,
      eventTypeOptions,
      eventoCreated.descripcion,
      eventoCreated.titulo,
      handleInputChange,
      handleInputChangeHorario,
      horarioCreated,
      onDateRangeChange,
      selectedUser,
      startTime,
      turnoOnChange,
      usersFiltered,
      users
    ]
  );

  const editModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        {eventType === EVENTTYPES.horario && (
          <>
            <HeaderCalendarModals
              selectedUser={selectedUser}
              dateRange={dateRange}
              horarioEvent={thisHorarioEvent?.horario}
            />
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
            <OnlyLabel label="Turno de inicio" xs={12}>
              <CustomDatePicker
                value={startTimeEdit}
                showTimeSelectOnly={true}
                showTimeSelect={true}
                timeCaption="Horas"
                tI={30}
                dateFormat={'hh:mm aa'}
                onChange={turnoOnChangeEdit}
              />
            </OnlyLabel>
          </>
        )}
        {eventType === EVENTTYPES.evento && (
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
      eventType,
      handleInputChangeEdit,
      handleInputChangeHorarioEdit,
      onDateRangeChange,
      selectedUser,
      startTimeEdit,
      thisEventoEvent?.evento.descripcion,
      thisEventoEvent?.evento.titulo,
      thisHorarioEvent,
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
      const evento: Partial<Eventos> = {
        descripcion: eventoCreated.descripcion ?? '',
        titulo: eventoCreated.titulo ?? '',
        rangoFechas: dateRangeFormatted
      };
      await addEvento(evento as Eventos);
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
      delete newEventUpdated.id;
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
      }
      hideEdit();
      await getEmployeesSync();
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

  useEffect(() => {
    if (!canAccesoHorarios) setSelectedUser(users.find((u) => u.id === thisUserActive.id) ?? null);
  }, [canAccesoHorarios, thisUserActive.id, users]);

  useEffect(() => {
    if (!canCrearHorarios) setEventType(EVENTTYPES.evento);
    if (!canCrearEventos) setEventType(EVENTTYPES.horario);
    if (!canCrearHorarios && !canCrearEventos) setEventType(null);
  }, [canCrearEventos, canCrearHorarios]);

  const showDeleteButton: boolean = useMemo((): boolean => {
    if (canEliminarHorarios && eventType === EVENTTYPES.horario) return true;
    if (canEliminarEventos && eventType === EVENTTYPES.evento) return true;
    return false;
  }, [canEliminarEventos, canEliminarHorarios, eventType]);

  const disabledEditPermiso: boolean = useMemo(() => {
    if (eventType === EVENTTYPES.horario) return !canEditarHorarios;
    if (eventType === EVENTTYPES.evento) return !canEditarEventos;
    return true;
  }, [canEditarEventos, canEditarHorarios, eventType]);

  if (
    !hasPermission(
      PERMISOS_MAP_IDS.accesoCalendario,
      thisUserActive.roles,
      thisUserActive.permisosOtorgados,
      thisUserActive.permisosDenegados
    )
  ) {
    return <Navigate to={DEFAULT_HOME_ROUTER_PATH} replace />;
  }

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Calendario" />
      <Card>
        <Card.Body>
          <Row>
            <Col xl={2}>
              <div>
                <h5 className="text-center">¿Cómo funciona?</h5>
                <ul className="ps-3">
                  <li className="text-muted mb-1 font-14">
                    Selecciona las fechas en el calendario y ajusta el rango arrastrando y soltando según sea necesario.
                  </li>
                  <li className="text-muted mb-1 font-14">
                    Podrás crear eventos generales visibles para todos, o asignar horarios específicos a los usuarios.
                    Recuerda que debes tener un usuario seleccionado en la lista de abajo para asignar horarios.
                  </li>
                </ul>
              </div>
              {canAccesoHorarios && (
                <UsersColumnList
                  users={usersFiltered}
                  isLoadingUsers={isLoadingUsers}
                  onUserSelect={handleUserSelection}
                  search={search}
                  selectedUser={selectedUser}
                />
              )}
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
        variant={eventType === EVENTTYPES.horario ? 'info' : undefined}
        headerText={`Crear nuevo ${eventType} ${eventType === EVENTTYPES.horario ? `a ${getNombreCompletoUser(selectedUser ? selectedUser : ({} as Employee))}` : ''} `}
        submitText="Crear"
        secondaryText="Cancelar"
        body={addModalBody}
        isDisabled={canCreateHorarioButCannotAccess || isSavingEvento || isLoadingAddHorario}
        isLoading={isSavingEvento || isLoadingAddHorario}
        onSend={onCreateEvent}
      />
      <GenericModal
        show={isOpenEdit}
        onToggle={toggleEdit}
        showDeleteButton={showDeleteButton}
        variant={eventType === EVENTTYPES.horario ? 'info' : undefined}
        headerText={`${eventType} ${eventType === EVENTTYPES.horario ? `de ${getNombreCompletoUser(selectedUser ? selectedUser : ({} as Employee))}` : ''} `}
        submitText="Editar"
        secondaryText="Cancelar"
        isDisabled={
          disabledEditPermiso ||
          isDeletingEvento ||
          isLoadingDeleteHorario ||
          isUpdatingTheEvento ||
          isLoadingUpdateHorario
        }
        isLoading={isDeletingEvento || isLoadingDeleteHorario || isUpdatingTheEvento || isLoadingUpdateHorario}
        body={editModalBody}
        onSend={onEditEvent}
        onDelete={onDeleteEvent}
      />
    </ToastWrapper>
  );
});

export {Calendario};
