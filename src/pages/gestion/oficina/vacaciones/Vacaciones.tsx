import {memo, useCallback, JSX, useMemo, useState, useEffect} from 'react';
import {Card, Col, Form, Row} from 'react-bootstrap';
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
import {FormWrapper, SelectField} from '@/components/Form2';
import {VacacionesType, Option} from '@/types';

const Vacaciones = memo(function Vacaciones() {
  const [vacacionesCreated, setVacacionesCreated] = useState<VacacionesType>({
    uuid: '',
    approver: '',
    rangoFechas: [],
    aprobadas: null
  });
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
      const {end, start} = arg;
      onDateChangeRange([start, DateUtils.addDays(end, -1)]);
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
        <Col xs={12}>
          <Form.Label htmlFor="rangoFechas" className="mb-1">
            <strong>Rango de fechas de duración</strong>
          </Form.Label>
          <DatepickerRange
            dateFormat="MMMM d, yyyy"
            isRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(date: Date) => onDateChangeRange(date)}
          />
        </Col>
      </FormWrapper>
    ),
    [approversOptions, dateRange, onDateChangeRange, vacacionesCreated.approver]
  );

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Vacaciones" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              {isLoadingUsers ? (
                <SkeletonLoader customClass="p-0" height="66vh" />
              ) : (
                <CalendarWidget events={events} onSelect={onSelectSet} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
