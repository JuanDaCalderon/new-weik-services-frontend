import {SkeletonLoader} from '@/components/SkeletonLoader';
import ReactTable from '@/components/table/ReactTable';
import {ExportColumn, EmployeeWithFilterDate, HorasTrabajoType} from '@/types';
import {memo, useCallback, useMemo, useState} from 'react';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row as RowType} from '@tanstack/react-table';
import {
  calcularHorasExtras,
  calcularHorasTrabajadas,
  DateUtils,
  filtrarHorariosPorFecha,
  getNombreCompletoUser,
  obtenerDiasVacaciones
} from '@/utils';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {CustomDatePicker, DatepickerRange, TablePdf} from '@/components';
import {useDatePicker, useExportToExcel} from '@/hooks';
import {useTranslation} from 'react-i18next';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import {PDFViewer} from '@react-pdf/renderer';

type asistenciDataType = {
  fecha: string;
  checkIn: string;
  checkOut: string;
  horasDeTrabajo: string;
  horasDeTrabajoExtra: string;
};

export const asistenciaColumnsPdf: ExportColumn<asistenciDataType>[] = [
  {
    field: 'fecha',
    header: 'Fecha'
  },
  {
    field: 'checkIn',
    header: 'Entrada'
  },
  {
    field: 'checkOut',
    header: 'Salida'
  },
  {
    field: 'horasDeTrabajo',
    header: 'Total trabajado'
  },
  {
    field: 'horasDeTrabajoExtra',
    header: 'Total extras'
  }
];

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
  const {t} = useTranslation();
  const [filtroActivo, setFiltroActivo] = useState<'ninguno' | 'mes' | 'rango'>('ninguno');
  const [iconHasLoad, setIconHasLoad] = useState<boolean>(false);
  const [pdf, setPdf] = useState<boolean>(false);
  const [filterMonth, setFilterMonth] = useState<Date>(new Date());
  const {dateRange, onDateChangeRange} = useDatePicker();
  const {exportToExcel} = useExportToExcel<asistenciDataType>();

  const horasTrabajo = useMemo(() => {
    switch (filtroActivo) {
      case 'mes':
        return calcularHorasTrabajadas(employee.horasTrabajo, filterMonth);
      case 'rango':
        return calcularHorasTrabajadas(employee.horasTrabajo, [dateRange[0] || new Date(), dateRange[1] || new Date()]);
      case 'ninguno':
      default:
        return calcularHorasTrabajadas(employee.horasTrabajo, filterMonth);
    }
  }, [dateRange, employee.horasTrabajo, filterMonth, filtroActivo]);

  const horasExtras = useMemo(() => {
    switch (filtroActivo) {
      case 'mes':
        return calcularHorasExtras(employee.horasTrabajo, filterMonth);
      case 'rango':
        return calcularHorasExtras(employee.horasTrabajo, [dateRange[0] || new Date(), dateRange[1] || new Date()]);
      case 'ninguno':
      default:
        return calcularHorasExtras(employee.horasTrabajo, filterMonth);
    }
  }, [dateRange, employee.horasTrabajo, filterMonth, filtroActivo]);

  const diasOff = useMemo(() => {
    switch (filtroActivo) {
      case 'mes':
        return obtenerDiasVacaciones(employee.vacaciones, filterMonth).length;
      case 'rango':
        return obtenerDiasVacaciones(employee.vacaciones, [dateRange[0] || new Date(), dateRange[1] || new Date()])
          .length;
      case 'ninguno':
      default:
        return obtenerDiasVacaciones(employee.vacaciones, filterMonth).length;
    }
  }, [dateRange, employee.vacaciones, filterMonth, filtroActivo]);

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

  const infoCopy = useMemo(() => {
    switch (filtroActivo) {
      case 'mes':
        return `En ${DateUtils.getMonth(filterMonth)}`;
      case 'rango':
        return `${DateUtils.formatShortDate(dateRange[0] || new Date())} - ${DateUtils.formatShortDate(dateRange[1] || new Date())}`;
      case 'ninguno':
      default:
        return `En ${DateUtils.getMonth(filterMonth)}`;
    }
  }, [dateRange, filterMonth, filtroActivo]);

  const exportData: asistenciDataType[] = useMemo(() => {
    return horariosFiltered.map((horario) => ({
      fecha: DateUtils.formatShortDate(new Date(horario.dia.split('/').reverse().join('/'))),
      checkIn: horario.checkIn ? DateUtils.getTimeOnly(new Date(horario.checkIn), false) : '-',
      checkOut: horario.checkOut ? DateUtils.getTimeOnly(new Date(horario.checkOut), false) : '-',
      horasDeTrabajo: `${horario.horasDeTrabajo} Hs : ${horario.minutosDeTrabajo} Min`,
      horasDeTrabajoExtra: `${horario.horasDeTrabajoExtra} Hs : ${horario.minutosDeTrabajoExtra} Min`
    }));
  }, [horariosFiltered]);

  const pdfToggle = useCallback(() => setPdf((prev) => !prev), []);

  const handleExportExcel = useCallback(() => {
    return exportToExcel(exportData, asistenciaColumnsPdf, 'Reporte');
  }, [exportData, exportToExcel]);

  return (
    <>
      <Card className="mb-2 bg-primary">
        <Card.Body className="profile-user-box p-2">
          <Row className="row-gap-2">
            <Col xs="auto" xl="1">
              <div className="avatar-md position-relative">
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
            <Col xs="6" lg="4" xl="3" className="ms-auto">
              <Card className="tilebox-one m-0">
                <Card.Body className="p-2 position-relative">
                  <h6 className="text-muted text-uppercase mt-0">Horas trabajadas</h6>
                  <i className="ri-time-line float-end text-muted font-24"></i>
                  <div className="d-flex">
                    <h3 className="m-0 font-18">{horasTrabajo.horas}Hs</h3>
                    <h3 className="m-0 ms-1 font-18">{horasTrabajo.minutos}Min</h3>
                  </div>
                  <span className="text-muted">{infoCopy}</span>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="6" lg="4" xl="3" className="ms-auto">
              <Card className="tilebox-one m-0">
                <Card.Body className="p-2 position-relative">
                  <h6 className="text-muted text-uppercase mt-0">Horas extras</h6>
                  <i className="ri-timer-2-line float-end text-muted font-24"></i>
                  <div className="d-flex">
                    <h3 className="m-0 font-18">{horasExtras.horas}Hs</h3>
                    <h3 className="m-0 ms-1 font-18">{horasExtras.minutos}Min</h3>
                  </div>
                  <span className="text-muted">{infoCopy}</span>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="12" lg="4" xl="3" className="ms-auto">
              <Card className="tilebox-one m-0">
                <Card.Body className="p-2 position-relative">
                  <h6 className="text-muted text-uppercase mt-0">Ausencias</h6>
                  <i className="ri-home-smile-line float-end text-muted font-24"></i>
                  <div className="d-flex">
                    <h3 className="m-0 font-18">{diasOff} Días</h3>
                  </div>
                  <span className="text-muted">{infoCopy}</span>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Row className="mx-0 p-0 mb-2 column-gap-1 row-gap-2">
        <Col xs="auto" className="d-flex align-items-center m-0 p-0">
          <Button
            onClick={() => {
              setFiltroActivo('ninguno');
              setFilterMonth(new Date());
              onDateChangeRange([new Date(), null]);
            }}
            variant="light">
            Limpiar filtros
          </Button>
        </Col>
        <Col xs="auto" className="d-flex align-items-center m-0 p-0">
          <Button onClick={pdfToggle} variant="light">
            PDF
          </Button>
        </Col>
        <Col xs="auto" className="d-flex align-items-center m-0 p-0">
          <Button onClick={handleExportExcel} variant="light">
            Excel
          </Button>
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

      {horariosFiltered.length > 0 && exportData.length > 0 && pdf && (
        <Row className="mt-2">
          <Col>
            <PDFViewer style={{width: '100%', height: '40vh'}}>
              <TablePdf<asistenciDataType>
                columns={asistenciaColumnsPdf}
                data={exportData}
                title={`Asistencia de ${getNombreCompletoUser(employee)}`}
                orientation="portrait"
              />
            </PDFViewer>
          </Col>
        </Row>
      )}
    </>
  );
});

export {Asistencia};
