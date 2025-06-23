import {memo, useState, useEffect, useCallback, useMemo, JSX, ChangeEvent} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {CustomDatePicker, DatepickerRange, GenericModal, PageBreadcrumb} from '@/components';
import {DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import {ToastWrapper} from '@/components/Toast';
import {useAddHorario, useDeleteHorario, useUpdateHorario} from '@/endpoints';
import {calendarHorarioEventType, Employee, HorarioType} from '@/types';
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
  HOME_ROUTER_PATH,
  PERMISOS_MAP_IDS,
  SESSIONSTORAGE_CALENDAR_USER_SELECTED_KEY
} from '@/constants';
import toast from 'react-hot-toast';
import {HeaderCalendarModals} from './HeaderCalendarModals';
import {HORARIOCREATEDVALUES} from './initialValues';
import {Navigate} from 'react-router-dom';
import useHorarios from './hooks/useHorarios';

const HorarioCalendario = memo(function HorarioCalendario() {
  const [usersFiltered, setusersFiltered] = useState<Employee[]>([]);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [thisHorario, setThisHorario] = useState<calendarHorarioEventType>();
  const {dateRange, onDateChangeRange} = useDatePicker();
  const [startTime, setStartTime] = useState<Date>(DateUtils.getFormattedTime() as Date);
  const [startTimeEdit, setStartTimeEdit] = useState<Date>(DateUtils.getFormattedTime() as Date);
  const [horarioCreated, setHorarioCreated] = useState<HorarioType>(HORARIOCREATEDVALUES);
  const {addHorario, isLoadingAddHorario} = useAddHorario();
  const {deleteHorario, isLoadingDeleteHorario} = useDeleteHorario();
  const {updateHorario, isLoadingUpdateHorario} = useUpdateHorario();
  const {
    thisUserActive,
    users,
    isLoadingUsers,
    getEmployeesSync,
    canAccesoHorarios,
    canCrearHorarios,
    canEditarHorarios,
    canEliminarHorarios
  } = useHorarios();
  const {isOpen: isOpenAdd, toggle: toggleAdd, hide: hideAdd} = useTogglev2(false);
  const {isOpen: isOpenEdit, toggle: toggleEdit, hide: hideEdit} = useTogglev2(false);

  useEffect(() => {
    if (users.length > 0) {
      setusersFiltered(users);
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

  const horarios: EventInput[] = useMemo(() => {
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
    return selectedUser && selectedUser.horario.length > 0
      ? selectedUser.horario.map((h, index) => {
          const start = DateUtils.parseStringToDate(h.rangoFechas[0]);
          const end = DateUtils.addDays(DateUtils.parseStringToDate(h.rangoFechas[1]), 1);
          const title = `Hora entrada ${DateUtils.convertTo12HourFormat(h.horaInicio)} - ${h.horasDeTrabajo} Horas - ${h.break} Minutos de break`;
          return createEventInput(`horario-${selectedUser.id}-${index}`, title, start, end, 'bg-primary', h);
        })
      : [];
  }, [selectedUser]);

  const onSelectSet = useCallback(
    (arg: DateSelectArg) => {
      const {end, start} = arg;
      onDateChangeRange([start, DateUtils.addDays(end, -1)]);
      if (canCrearHorarios) toggleAdd();
    },
    [canCrearHorarios, onDateChangeRange, toggleAdd]
  );

  const onHorarioClickSet = useCallback(
    (arg: EventClickArg) => {
      const {event} = arg;
      const {id, extendedProps, start, end} = event;
      const thisId = id.split('-')[1];
      setThisHorario({id: thisId, horario: extendedProps as HorarioType});
      onDateChangeRange([start ?? new Date(), DateUtils.addDays(end ?? new Date(), -1)]);
      setStartTimeEdit(
        DateUtils.getFormattedTime(
          true,
          new Date(),
          +(extendedProps as HorarioType).horaInicio.split(':')[0]!,
          +(extendedProps as HorarioType).horaInicio.split(':')[1]!
        ) as Date
      );
      if (canEditarHorarios || canEliminarHorarios) toggleEdit();
    },
    [canEditarHorarios, canEliminarHorarios, onDateChangeRange, toggleEdit]
  );

  const onDateRangeChange = useCallback((date: Date) => onDateChangeRange(date), [onDateChangeRange]);

  const handleInputChangeHorario = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setHorarioCreated((prev) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleInputChangeHorarioEdit = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setThisHorario((prev) => {
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
    setThisHorario((prev) => {
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

  const canCreateHorarioButCannotAccess: boolean = useMemo(() => {
    return canCrearHorarios && !canAccesoHorarios;
  }, [canAccesoHorarios, canCrearHorarios]);

  const addModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
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
        <hr />
        <HeaderCalendarModals selectedUser={selectedUser} dateRange={dateRange} horario={horarioCreated} />
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
      handleInputChangeHorario,
      horarioCreated,
      onDateRangeChange,
      selectedUser,
      startTime,
      turnoOnChange,
      users,
      usersFiltered
    ]
  );

  const editModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        <HeaderCalendarModals selectedUser={selectedUser} dateRange={dateRange} horario={thisHorario?.horario} />
        <InputField
          xs={6}
          label="Horas de trabajo"
          name="horasDeTrabajo"
          type="number"
          value={thisHorario?.horario.horasDeTrabajo}
          onChange={handleInputChangeHorarioEdit}
        />
        <SelectField
          options={BREAKSOPTIONS}
          xs={6}
          name="break"
          label="Break en minutos"
          defaultValue={thisHorario?.horario.break.toString()}
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
      handleInputChangeHorarioEdit,
      onDateRangeChange,
      selectedUser,
      startTimeEdit,
      thisHorario?.horario,
      turnoOnChangeEdit
    ]
  );

  const onCreateHorario = useCallback(async () => {
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];
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
  }, [
    addHorario,
    dateRange,
    getEmployeesSync,
    hideAdd,
    horarioCreated.break,
    horarioCreated.horaInicio,
    horarioCreated.horasDeTrabajo,
    selectedUser
  ]);

  const onEditHorario = useCallback(async () => {
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];
    if (thisHorario) {
      let newHorarioUpdated: Partial<HorarioType> = {
        ...thisHorario.horario
      };
      if (!areStringArraysEqual(thisHorario.horario.rangoFechas, dateRangeFormatted)) {
        newHorarioUpdated.rangoFechas = dateRangeFormatted;
      } else delete newHorarioUpdated.rangoFechas;
      delete newHorarioUpdated.uuid;
      if (selectedUser) {
        const {id} = selectedUser;
        await updateHorario(id, thisHorario.horario.uuid, newHorarioUpdated);
      }
      hideEdit();
      await getEmployeesSync();
    }
  }, [dateRange, getEmployeesSync, hideEdit, selectedUser, thisHorario, updateHorario]);

  const onDeleteHorario = useCallback(async () => {
    if (thisHorario && selectedUser) {
      await deleteHorario(selectedUser.id, thisHorario.horario.uuid);
      hideEdit();
      await getEmployeesSync();
    }
  }, [deleteHorario, getEmployeesSync, hideEdit, selectedUser, thisHorario]);

  useEffect(() => {
    if (!canAccesoHorarios) setSelectedUser(users.find((u) => u.id === thisUserActive.id) ?? null);
  }, [canAccesoHorarios, thisUserActive.id, users]);

  if (
    !hasPermission(
      PERMISOS_MAP_IDS.accesoHorarios,
      thisUserActive.roles,
      thisUserActive.permisosOtorgados,
      thisUserActive.permisosDenegados
    )
  ) {
    return <Navigate to={HOME_ROUTER_PATH} replace />;
  }

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Horarios" />
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
                    Podrás crear horarios específicos a los usuarios, recuerda que debes tener un usuario seleccionado
                    en la lista de abajo para asignar horarios.
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
              {isLoadingUsers ? (
                <SkeletonLoader customClass="p-0" height="66vh" />
              ) : (
                <CalendarWidget events={horarios} onSelect={onSelectSet} onEventClick={onHorarioClickSet} />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <GenericModal
        show={isOpenAdd}
        onToggle={toggleAdd}
        variant="info"
        headerText={`Crear nuevo horario a ${getNombreCompletoUser(selectedUser ?? ({} as Employee))}`}
        submitText="Crear"
        body={addModalBody}
        isDisabled={canCreateHorarioButCannotAccess || isLoadingAddHorario}
        isLoading={isLoadingAddHorario}
        onSend={onCreateHorario}
      />
      <GenericModal
        show={isOpenEdit}
        onToggle={toggleEdit}
        showDeleteButton={canEliminarHorarios}
        variant="info"
        headerText={`Horario de ${getNombreCompletoUser(selectedUser ?? ({} as Employee))} `}
        isDisabled={!canEditarHorarios || isLoadingDeleteHorario || isLoadingUpdateHorario}
        isLoading={isLoadingDeleteHorario || isLoadingUpdateHorario}
        body={editModalBody}
        onSend={onEditHorario}
        onDelete={onDeleteHorario}
      />
    </ToastWrapper>
  );
});

export {HorarioCalendario};
