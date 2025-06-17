import {memo, useCallback, JSX, useMemo, useState, useEffect} from 'react';
import {Card, Col, Form, Row} from 'react-bootstrap';
import {DatepickerRange, GenericModal, PageBreadcrumb} from '@/components';
import {ToastWrapper} from '@/components/Toast';
import {CalendarWidget} from '@/components/Calendar';
import useVacaciones from './hooks/useVacaciones';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {DateSelectArg, EventClickArg} from '@fullcalendar/core';
import {areStringArraysEqual, DateUtils, getNombreCompletoUser, hasPermission} from '@/utils';
import {useDatePicker, useTogglev2} from '@/hooks';
import toast from 'react-hot-toast';
import {useAddVacaciones, useApproveVacaciones, useUpdateVacaciones} from '@/endpoints';
import {FormWrapper, OnlyLabel, SelectField} from '@/components/Form2';
import {VacacionesType, Option, Employee} from '@/types';
import {VACACIONESCREATEDVALUES, VACACIONESEDITVALUES} from './initialValues';
import {DEFAULT_HOME_ROUTER_PATH, PERMISOS_MAP_IDS} from '@/constants';
import {Navigate} from 'react-router-dom';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';

const Vacaciones = memo(function Vacaciones() {
  const [vacacionesCreated, setVacacionesCreated] = useState<VacacionesType>(VACACIONESCREATEDVALUES);
  const [vacacionesEdited, setVacacionesEdited] = useState<Partial<VacacionesType>>(VACACIONESEDITVALUES);
  const [whoIsThisVacactions, setWhoIsThisVacactions] = useState<Employee>();
  const [isStillPending, setIsStillPending] = useState<boolean>(true);
  const [editHasChanged, setEditHasChanged] = useState<boolean>(false);
  const [amAbleToApproveThisVacation, setAmAbleToApproveThisVacation] = useState<boolean>(false);
  const {isOpen: isOpenAdd, toggle: toggleAdd, hide: hideAdd} = useTogglev2(false);
  const {isOpen: isOpenEdit, toggle: toggleEdit, hide: hideEdit} = useTogglev2(false);
  const {isOpen: isOpenApprover, toggle: toggleApprover, hide: hideApprover} = useTogglev2(false);
  const {dateRange, onDateChangeRange} = useDatePicker();
  const {
    events,
    isLoadingUsers,
    users,
    user,
    canAprobarVacaciones,
    handleSwitchChange,
    isCheckedOnlyMyVacations,
    handleSwitchChangePendingVacations,
    isCheckedPendingVacations,
    getEmployeesSync
  } = useVacaciones();
  const {addVacaciones, isLoadingAddVacaciones} = useAddVacaciones();
  const {updateVacaciones, isLoadingUpdateVacaciones} = useUpdateVacaciones();
  const {approveVacaciones, isLoadingApproveVacaciones} = useApproveVacaciones();
  const {id} = useAppSelector(selectUser);

  const approversOptions: Option[] = useMemo(() => {
    if (users.length === 0) return [];
    return users
      .filter((u: Employee) => {
        const canApprove = hasPermission(
          PERMISOS_MAP_IDS.aprobarVacaciones,
          u.roles,
          u.permisosOtorgados,
          u.permisosDenegados
        );
        return canApprove && u.id !== id;
      })
      .map((u: Employee) => ({value: u.id, label: getNombreCompletoUser(u)}));
  }, [id, users]);

  useEffect(() => {
    if (approversOptions.length > 0) setVacacionesCreated((prev) => ({...prev, approver: approversOptions[0].value}));
  }, [approversOptions]);

  const onSelectSet = useCallback(
    (arg: DateSelectArg) => {
      onDateChangeRange([arg.start, DateUtils.addDays(arg.end, -1)]);
      toggleAdd();
    },
    [onDateChangeRange, toggleAdd]
  );

  const onEventClickSet = useCallback(
    (arg: EventClickArg) => {
      const {event} = arg;
      const {id, extendedProps, start, end} = event;
      const userId = id.split('-')[1];
      const isMyVacation = userId === user.id;
      setWhoIsThisVacactions(users.find((u) => u.id === userId));
      setIsStillPending((extendedProps as VacacionesType).aprobadas === null);
      onDateChangeRange([start ?? new Date(), DateUtils.addDays(end ?? new Date(), -1)]);
      setVacacionesEdited((prev) => ({
        ...prev,
        uuid: (extendedProps as VacacionesType).uuid,
        approver: (extendedProps as VacacionesType).approver,
        rangoFechas: (extendedProps as VacacionesType).rangoFechas
      }));
      setAmAbleToApproveThisVacation((extendedProps as VacacionesType).approver === user.id);
      if (isMyVacation) toggleEdit();
      else if (canAprobarVacaciones) toggleApprover();
    },
    [canAprobarVacaciones, onDateChangeRange, toggleApprover, toggleEdit, user.id, users]
  );

  const addModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        <SelectField
          options={approversOptions}
          xs={12}
          label="Usuario que aprobará la solicitud"
          defaultValue={vacacionesCreated.approver}
          onChange={(e) => setVacacionesCreated((prev) => ({...prev, approver: e.target.value}))}
        />
        <OnlyLabel label="Rango de fechas de duración" xs={12}>
          <DatepickerRange
            dateFormat="MMMM d, yyyy"
            isRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(date: Date) => onDateChangeRange(date)}
          />
        </OnlyLabel>
      </FormWrapper>
    ),
    [approversOptions, dateRange, onDateChangeRange, vacacionesCreated.approver]
  );

  const editModalBody: JSX.Element = useMemo(
    () => (
      <FormWrapper showSubmitButton={false}>
        <SelectField
          options={approversOptions}
          xs={12}
          label="Usuario que aprobará la solicitud"
          disabled={!isStillPending}
          defaultValue={vacacionesEdited.approver}
          onChange={(e) => {
            setVacacionesEdited((prev) => ({...prev, approver: e.target.value}));
            setEditHasChanged(true);
          }}
        />
        <OnlyLabel label="Rango de fechas de duración" xs={12}>
          <DatepickerRange
            dateFormat="MMMM d, yyyy"
            isRange={true}
            disabled={!isStillPending}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(date: Date) => {
              onDateChangeRange(date);
              setEditHasChanged(true);
            }}
          />
        </OnlyLabel>
        {isStillPending ? (
          <p className="font-14 text-muted m-0">
            <span className="fw-bold text-uppercase">Nota:</span> Puedes editar tus vacaciones hasta que sean aprobadas
            o denegadas.
          </p>
        ) : (
          <p className="font-14 text-muted m-0">
            <span className="fw-bold text-uppercase">Nota:</span> No puedes editar tus vacaciones, ya han sido
            procesadas.
          </p>
        )}
      </FormWrapper>
    ),
    [approversOptions, dateRange, isStillPending, onDateChangeRange, vacacionesEdited.approver]
  );

  const defaultApproverSelected = useMemo(() => {
    if (vacacionesEdited && vacacionesEdited.approver) {
      const approver = users.find((u) => u.id === vacacionesEdited.approver);
      if (approver) return approver;
    }
  }, [users, vacacionesEdited]);

  const approveModalBody: JSX.Element = useMemo(
    () => (
      <>
        {amAbleToApproveThisVacation ? (
          <>
            {isStillPending ? (
              <p>
                {' '}
                Puedes aprovar las vacaciones de{' '}
                {whoIsThisVacactions && (
                  <span className="fw-bold text-uppercase">{getNombreCompletoUser(whoIsThisVacactions)}</span>
                )}
              </p>
            ) : (
              <p className="font-14">
                {' '}
                <span className="fw-bold text-uppercase">No</span> puedes aprobar o denegar estas vacaciones, ya han
                sido procesadas.
              </p>
            )}
            <OnlyLabel label="Duración de las vacaciones" xs={12}>
              <DatepickerRange
                dateFormat="MMMM d, yyyy"
                isRange={true}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                disabled={true}
                onChange={() => {}}
              />
            </OnlyLabel>
          </>
        ) : (
          <p className="font-14 m-0">
            <span className="fw-bold text-uppercase">No</span> puedes aprobar estas vacaciones, solo el usuario{' '}
            {defaultApproverSelected ? (
              <span className="fw-bold text-uppercase">{getNombreCompletoUser(defaultApproverSelected)}</span>
            ) : (
              <span className="fw-bold text-uppercase">asignado</span>
            )}{' '}
            las puede aprobar.
          </p>
        )}
      </>
    ),
    [amAbleToApproveThisVacation, dateRange, defaultApproverSelected, isStillPending, whoIsThisVacactions]
  );

  const onCreateVacaciones = useCallback(async () => {
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];
    const newVacaciones: VacacionesType = {
      ...vacacionesCreated,
      rangoFechas: dateRangeFormatted
    };
    await addVacaciones(newVacaciones);
    hideAdd();
    await getEmployeesSync();
  }, [addVacaciones, dateRange, getEmployeesSync, hideAdd, vacacionesCreated]);

  const onEditVacations = useCallback(async () => {
    if (dateRange[0] === null || dateRange[1] === null) {
      toast.error('Por favor selecciona un rango de fechas');
      return;
    }
    const dateRangeFormatted: [string, string] = [
      DateUtils.formatDateToString(dateRange[0]!),
      DateUtils.formatDateToString(dateRange[1]!)
    ];
    let newVacacionesUpdated: Partial<VacacionesType> = {
      ...vacacionesEdited
    };
    if (vacacionesEdited.rangoFechas && !areStringArraysEqual(vacacionesEdited.rangoFechas, dateRangeFormatted)) {
      newVacacionesUpdated.rangoFechas = dateRangeFormatted;
    } else delete newVacacionesUpdated.rangoFechas;
    delete newVacacionesUpdated.uuid;
    delete newVacacionesUpdated.aprobadas;
    await updateVacaciones(user.id, vacacionesEdited.uuid!, newVacacionesUpdated);
    hideEdit();
    await getEmployeesSync();
    setEditHasChanged(false);
  }, [dateRange, getEmployeesSync, hideEdit, updateVacaciones, user.id, vacacionesEdited]);

  const onApproveVacations = useCallback(async () => {
    if (whoIsThisVacactions && whoIsThisVacactions.id && vacacionesEdited && vacacionesEdited.uuid) {
      await approveVacaciones(whoIsThisVacactions.id, vacacionesEdited.uuid, true);
      hideApprover();
      await getEmployeesSync();
    }
  }, [approveVacaciones, getEmployeesSync, hideApprover, vacacionesEdited, whoIsThisVacactions]);

  const onDenegarVacations = useCallback(async () => {
    if (whoIsThisVacactions && whoIsThisVacactions.id && vacacionesEdited && vacacionesEdited.uuid) {
      await approveVacaciones(whoIsThisVacactions.id, vacacionesEdited.uuid, false);
      hideApprover();
      await getEmployeesSync();
    }
  }, [approveVacaciones, getEmployeesSync, hideApprover, vacacionesEdited, whoIsThisVacactions]);

  if (!hasPermission(PERMISOS_MAP_IDS.accesoVacaciones, user.roles, user.permisosOtorgados, user.permisosDenegados)) {
    return <Navigate to={DEFAULT_HOME_ROUTER_PATH} replace />;
  }

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Vacaciones" />
      <Card>
        <Card.Body>
          <Row>
            <Col xl={2}>
              <div>
                <h5 className="text-center">¿Cómo funciona?</h5>
                <ul className="ps-3">
                  <li className="text-muted mb-1 font-14">
                    Selecciona las fechas en el calendario y ajusta el rango arrastrando y soltando según sea necesario
                    para crear una solicitud de vacaciones.
                  </li>
                  <li className="text-muted mb-1 font-14">
                    Selecciona el usuario que aprobará la solicitud de vacaciones en el formulario.
                  </li>
                  <li className="text-muted mb-1 font-14">
                    Recuerda que puedes editar tus propias solicitudes de vacaciones si estas aún están pendientes
                    haciendo click en el evento del calendario.
                  </li>
                  {canAprobarVacaciones && (
                    <>
                      <li className="text-muted mb-1 font-14">
                        Podrás aprobar o denegar solicitudes de vacaciones de otros usuarios haciendo click en el evento
                        del calendario.
                      </li>
                      <li className="text-muted mb-1 font-14">
                        🟢 Significa que puedes aprobar estas solicitudes de vacaciones, ya que el usuario te ha
                        asignado como su aprobador.
                      </li>
                      <li className="text-muted mb-1 font-14">
                        ⚫ Significa que no puedes aprobar estas solicitudes de vacaciones, ya que el usuario no te ha
                        asignado como su aprobador.
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <hr />
              <Form.Check
                reverse
                className="cursor-pointer"
                type="switch"
                id="mis vacaciones"
                label="Mostrar solo mis vacaciones"
                checked={isCheckedOnlyMyVacations}
                onChange={handleSwitchChange}
              />
              {canAprobarVacaciones && (
                <Form.Check
                  reverse
                  className="cursor-pointer mt-1"
                  type="switch"
                  id="vacaciones pendientes"
                  label="Mostrar las vacaciones pendientes"
                  checked={isCheckedPendingVacations}
                  onChange={handleSwitchChangePendingVacations}
                />
              )}
            </Col>
            <Col xl={10}>
              {isLoadingUsers ? (
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
        headerText="Solicitud de vacaciones"
        submitText="Crear"
        secondaryText="Cancelar"
        body={addModalBody}
        isDisabled={isLoadingAddVacaciones}
        isLoading={isLoadingAddVacaciones}
        onSend={onCreateVacaciones}
      />
      <GenericModal
        show={isOpenEdit}
        onToggle={toggleEdit}
        variant="primary"
        headerText="Editar vacaciones"
        submitText="Editar"
        secondaryText="Cancelar"
        body={editModalBody}
        isDisabled={!editHasChanged || isLoadingUpdateVacaciones}
        isLoading={isLoadingUpdateVacaciones}
        onClose={() => setEditHasChanged(false)}
        onSend={onEditVacations}
      />
      <GenericModal
        show={isOpenApprover}
        onToggle={toggleApprover}
        headerText="Aprobar vacaciones"
        submitText="Aprobar"
        showDeleteButton={amAbleToApproveThisVacation}
        showSendButton={amAbleToApproveThisVacation}
        deleteText="Denegar"
        secondaryText="Cancelar"
        body={approveModalBody}
        isDisabled={!amAbleToApproveThisVacation || !isStillPending || isLoadingApproveVacaciones}
        isLoading={isLoadingApproveVacaciones}
        onSend={onApproveVacations}
        onDelete={onDenegarVacations}
      />
    </ToastWrapper>
  );
});

export {Vacaciones};
