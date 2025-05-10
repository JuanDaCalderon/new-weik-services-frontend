import {SkeletonLoader} from '@/components/SkeletonLoader';
import ReactTable from '@/components/table/ReactTable';
import {EmployeeWithFilterDate, HorasTrabajoType} from '@/types';
import {memo, useMemo, useState} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row as RowType} from '@tanstack/react-table';
import {
  calcularHorasExtras,
  calcularHorasTrabajadas,
  DateUtils,
  filtrarHorariosPorFecha,
  getNombreCompletoUser,
  obtenerDiasVacacionesDelMes
} from '@/utils';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {CustomDatePicker, DatepickerRange} from '@/components';
import {useDatePicker} from '@/hooks';
import {useTranslation} from 'react-i18next';
import fallBackLogo from '@/assets/images/logo-fallback.png';

const HoraColumn = memo(function HoraColumn({
  horasTrabajo,
  type
}: {
  horasTrabajo: HorasTrabajoType;
  type: 'checkIn' | 'checkOut';
}) {
  const hora = horasTrabajo?.[type];
  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {hora ? <span>{DateUtils.getTimeOnly(new Date(hora), false)}</span> : <span>-</span>}
      </span>
    </div>
  );
});

const EntradaColumn = memo(function EntradaColumn({row}: {row: RowType<HorasTrabajoType>}) {
  return <HoraColumn horasTrabajo={row.original} type="checkIn" />;
});

const SalidaColumn = memo(function SalidaColumn({row}: {row: RowType<HorasTrabajoType>}) {
  return <HoraColumn horasTrabajo={row.original} type="checkOut" />;
});

const TotalTrabajadoColumn = memo(function BreakColumn({row}: {row: RowType<HorasTrabajoType>}) {
  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {row.original.checkOut ? (
          <span>
            {row.original.horasDeTrabajo} Hs : {row.original.minutosDeTrabajo} Min
          </span>
        ) : (
          <span>-</span>
        )}
      </span>
    </div>
  );
});

const TotalTrabajadoExtraColumn = memo(function BreakColumn({row}: {row: RowType<HorasTrabajoType>}) {
  return (
    <div className="d-flex">
      <span className="m-0 lh-sm d-inline">
        {row.original.checkOut ? (
          <span>
            {row.original.horasDeTrabajoExtra} Hs : {row.original.minutosDeTrabajoExtra} Min
          </span>
        ) : (
          <span>-</span>
        )}
      </span>
    </div>
  );
});

const columns: ColumnDef<HorasTrabajoType>[] = [
  {
    header: 'Fecha',
    accessorKey: 'dia',
    cell: ({row}) => (
      <div className="d-flex">
        <span className="m-0 lh-sm d-inline">
          {DateUtils.formatShortDate(new Date(row.original.dia.split('/').reverse().join('/')))}
        </span>
      </div>
    )
  },
  {
    header: 'Entrada',
    accessorKey: 'checkIn',
    cell: EntradaColumn
  },
  {
    header: 'Salida',
    accessorKey: 'checkOut',
    cell: SalidaColumn
  },
  {
    header: 'Total trabajado',
    accessorKey: 'horasDeTrabajo',
    cell: TotalTrabajadoColumn
  },
  {
    header: 'Total extras',
    accessorKey: 'horasDeTrabajoExtra',
    cell: TotalTrabajadoExtraColumn
  }
];

const Asistencia = memo(function Asistencia({employee}: {employee: EmployeeWithFilterDate}) {
  const [filtroActivo, setFiltroActivo] = useState<'ninguno' | 'mes' | 'rango'>('ninguno');
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  const {t} = useTranslation();
  const [filterMonth, setFilterMonth] = useState<Date>(new Date());
  const {dateRange, onDateChangeRange} = useDatePicker();

  const horasTrabajo = useMemo(() => {
    return calcularHorasTrabajadas(employee.horasTrabajo, filterMonth);
  }, [employee.horasTrabajo, filterMonth]);

  const horasExtras = useMemo(() => {
    return calcularHorasExtras(employee.horasTrabajo, filterMonth);
  }, [employee.horasTrabajo, filterMonth]);

  const diasOff = useMemo(() => {
    return obtenerDiasVacacionesDelMes(employee.vacaciones, filterMonth).length;
  }, [employee.vacaciones, filterMonth]);

  const horariosFiltered = useMemo(() => {
    switch (filtroActivo) {
      case 'mes':
        return filtrarHorariosPorFecha(employee.horasTrabajo, filterMonth);
      case 'rango':
        return filtrarHorariosPorFecha(employee.horasTrabajo, [dateRange[0] || new Date(), dateRange[1] || new Date()]);
      case 'ninguno':
      default:
        return employee.horasTrabajo;
    }
  }, [employee.horasTrabajo, filterMonth, dateRange, filtroActivo]);

  return (
    <>
      <Card className="mb-2 bg-primary">
        <Card.Body className="profile-user-box p-2">
          <Row className="row-gap-2">
            <Col xs="auto">
              <div className="avatar-lg position-relative">
                {!iconHasLoad && <SkeletonLoader customClass="position-absolute p-0" />}
                <img
                  src={employee.userImage ? employee.userImage : fallBackLogo}
                  alt={employee.email}
                  className="rounded-circle img-thumbnail w-100 h-100 object-fit-contain"
                  onLoad={() => setIconHasLoad(true)}
                />
              </div>
            </Col>
            <Col xs="6" lg="8" xl="2" className="d-flex flex-column justify-content-center">
              <h4 className="mb-0 text-white">{getNombreCompletoUser(employee)}</h4>
              <p className="font-14 text-white">{employee.email}</p>
            </Col>
            <Col xs="6" lg="4" xl="2" className="ms-auto">
              <Card className="tilebox-one m-0">
                <Card.Body className="p-2 position-relative">
                  <h6 className="text-muted text-uppercase mt-0">Horas trabajadas</h6>
                  <i className="ri-time-line float-end text-muted font-24"></i>
                  <div className="d-flex">
                    <h3 className="m-0 font-18">{horasTrabajo.horas}Hs</h3>
                    <h3 className="m-0 ms-1 font-18">{horasTrabajo.minutos}Min</h3>
                  </div>
                  <span className="text-muted">En {DateUtils.getMonth(filterMonth)}</span>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="6" lg="4" xl="2" className="ms-auto">
              <Card className="tilebox-one m-0">
                <Card.Body className="p-2 position-relative">
                  <h6 className="text-muted text-uppercase mt-0">Horas extras</h6>
                  <i className="ri-timer-2-line float-end text-muted font-24"></i>
                  <div className="d-flex">
                    <h3 className="m-0 font-18">{horasExtras.horas}Hs</h3>
                    <h3 className="m-0 ms-1 font-18">{horasExtras.minutos}Min</h3>
                  </div>
                  <span className="text-muted">En {DateUtils.getMonth(filterMonth)}</span>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="12" lg="4" xl="2" className="ms-auto">
              <Card className="tilebox-one m-0">
                <Card.Body className="p-2 position-relative">
                  <h6 className="text-muted text-uppercase mt-0">Ausencias</h6>
                  <i className="ri-home-smile-line float-end text-muted font-24"></i>
                  <div className="d-flex">
                    <h3 className="m-0 font-18">{diasOff} Días</h3>
                  </div>
                  <span className="text-muted">En {DateUtils.getMonth(filterMonth)}</span>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Row className="mx-0 p-0 mb-2 column-gap-1">
        <Col className="m-0 p-0">
          <h4 className="header-title text-dark text-opacity-75">Asistencia</h4>
        </Col>
        <Col className="d-flex justify-content-end align-items-center m-0 p-0">
          <label className="p-0 my-0 ms-0 me-1">Mes</label>
          <CustomDatePicker
            hideAddon={true}
            dateFormat="MM/yyyy"
            showMonthYearPicker={true}
            value={filterMonth}
            onChange={(date) => {
              setFilterMonth(date);
              setFiltroActivo('mes');
            }}
          />
        </Col>
        <Col className="d-flex justify-content-end align-items-center m-0 p-0">
          <label className="p-0 my-0 ms-0 me-1">{t('reportes.asistencia.dates')}</label>
          <div className="w-100">
            <DatepickerRange
              dateFormat="MMMM d, yyyy"
              isRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(dates) => {
                onDateChangeRange(dates);
                setFiltroActivo('rango');
              }}
            />
          </div>
        </Col>
        <Col xs="auto" className="d-flex align-items-center m-0 p-0">
          <Button onClick={() => setFiltroActivo('ninguno')} variant="light">
            Limpiar filtros
          </Button>
        </Col>
      </Row>
      {!employee ? (
        <SkeletonLoader height="500px" customClass="p-0 mt-2" />
      ) : (
        <ReactTable<HorasTrabajoType>
          columns={columns}
          data={horariosFiltered}
          pageSize={10}
          tableClass="table-striped"
          showPagination
          isSearchable
        />
      )}
    </>
  );
});

export {Asistencia};
