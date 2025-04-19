import {memo, useCallback, JSX, useMemo, useState, useEffect} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {DatepickerRange, GenericModal, PageBreadcrumb} from '@/components';
import {ToastWrapper} from '@/components/Toast';
import {CalendarWidget} from '@/components/Calendar';
import useVacaciones from './hooks/useVacaciones';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {DateSelectArg} from '@fullcalendar/core';
import {DateUtils, getNombreCompletoUser} from '@/utils';
import {useDatePicker, useTogglev2} from '@/hooks';
import toast from 'react-hot-toast';
import {useAddVacaciones} from '@/endpoints';
import {FormWrapper, OnlyLabel, SelectField} from '@/components/Form2';
import {VacacionesType, Option} from '@/types';
import {VACACIONESCREATEDVALUES} from './initialValues';

const Vacaciones = memo(function Vacaciones() {
  const [vacacionesCreated, setVacacionesCreated] = useState<VacacionesType>(VACACIONESCREATEDVALUES);
  const {isOpen: isOpenAdd, toggle: toggleAdd, hide: hideAdd} = useTogglev2(false);
  const {dateRange, onDateChangeRange} = useDatePicker();
  const {events, isLoadingUsers, users, getEmployeesSync} = useVacaciones();
  const {addVacaciones, isLoadingAddVacaciones} = useAddVacaciones();
  const approversOptions: Option[] = useMemo(
    () => users.map((u) => ({value: u.id, label: getNombreCompletoUser(u)})),
    [users]
  );

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
                  <li className="text-muted mb-1 font-14">
                    Podrás aprobar o denegar solicitudes de vacaciones de otros usuarios haciendo click en el evento del
                    calendario según tengas el permiso correspondiente.
                  </li>
                  <li className="text-muted mb-1 font-14">
                    Si necesitas cancelar una solicitud de vacaciones, selecciona el evento en el calendario y utiliza
                    la opción de cancelación disponible.
                  </li>
                  <li className="text-muted mb-1 font-14">
                    Asegúrate de que las fechas seleccionadas no se solapen con otras solicitudes ya aprobadas.
                  </li>
                  <li className="text-muted mb-1 font-14">
                    Los administradores pueden ver un resumen de todas las solicitudes de vacaciones en la vista de
                    vacaciones.
                  </li>
                </ul>
              </div>
            </Col>
            <Col xl={10}>
              {isLoadingUsers ? (
                <SkeletonLoader customClass="p-0" height="66vh" />
              ) : (
                <CalendarWidget events={events} onSelect={onSelectSet} />
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
    </ToastWrapper>
  );
});

export {Vacaciones};
