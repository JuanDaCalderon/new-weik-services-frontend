import {memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {useParams} from 'react-router-dom';
import {Registros as RegistrosType, RegistrosProps, Cliente, RegistrosFilterMode} from '@/types';
import {selectClientes, selectRegistrosByClienteYTipo} from '@/store/selectores';
import {useSelector} from 'react-redux';
import {useLoadRegistros} from '@/pages/clientes/registros/hooks/useLoadRegistros';
import {LoadRegistros} from '@/pages/clientes/registros/components/LoadRegistros';
import {AgregarRegistros} from '@/pages/clientes/registros/components/AgregarRegistros';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useExpertExcel} from '@/pages/clientes/registros/hooks/useExpertExcel';
import {useGetColumns} from '@/pages/clientes/registros/hooks/useGetColumns';
import {PDFViewer} from '@react-pdf/renderer';
import {DatepickerRange, TablePdf, CustomDatePicker} from '@/components';
import {DeleteRegistros} from './components/DeleteRegistros';
import {useAppSelector} from '@/store';
import {useDatePicker} from '@/hooks';
import {REGISTRO_PRIORIDAD, REGISTRO_STATUS_SIN_ENTREGADO} from '@/constants';
import {DateUtils} from '@/utils';

const Registros = memo(function Registros({registerType}: RegistrosProps) {
  const {cliente} = useParams<{cliente: string}>();
  const clientes = useAppSelector(selectClientes);
  const {tiposRegistros} = useMemo(() => {
    return clientes.find((c) => c.domain === cliente) || ({tiposRegistros: []} as unknown as Cliente);
  }, [cliente, clientes]);
  const selectRegistros = useMemo(() => {
    if (!cliente) return null;
    return selectRegistrosByClienteYTipo(cliente, registerType);
  }, [cliente, registerType]);
  const [pdf, setPdf] = useState<boolean>(false);
  const {registros, isLoading} = useSelector(selectRegistros || (() => ({registros: [], isLoading: false})));
  const {checkRecords, toggleCheck, refreashRegistros} = useLoadRegistros(cliente, registerType, registros.length);
  const pdfToggle = useCallback(() => setPdf((prev) => !prev), []);
  const {exportData, handleExportExcel} = useExpertExcel(registros, tiposRegistros, registerType);
  const {registrosColumns, registrosColumnsPdf} = useGetColumns(tiposRegistros, registerType);
  const [filterMode, setFilterMode] = useState<RegistrosFilterMode>({
    isInEstado: false,
    isInDeliveryDate: false,
    isInRequestDate: false,
    isInRangeDates: false,
    isInPrioridad: false
  });
  const {dateRange, onDateChangeRange} = useDatePicker();
  const [requestFilterDate, setRequestFilterDate] = useState<Date>(new Date());
  const [deliveryFilterDate, setDeliveryFilterDate] = useState<Date>(new Date());
  const [filterStados, setFilterStados] = useState<REGISTRO_STATUS_SIN_ENTREGADO>(REGISTRO_STATUS_SIN_ENTREGADO.ALL);
  const [filterPrioridad, setFilterPrioridad] = useState<REGISTRO_PRIORIDAD>(REGISTRO_PRIORIDAD.SINPRIORIDAD);
  const estadoLabels = {
    [REGISTRO_STATUS_SIN_ENTREGADO.ALL]: 'Todos',
    [REGISTRO_STATUS_SIN_ENTREGADO.ENPROGRESO]: 'En Progreso',
    [REGISTRO_STATUS_SIN_ENTREGADO.PAUSA]: 'En Pausa',
    [REGISTRO_STATUS_SIN_ENTREGADO.COMPLETADO]: 'Completado'
  };
  const prioridadLabels = {
    [REGISTRO_PRIORIDAD.SINPRIORIDAD]: 'Sin Prioridad',
    [REGISTRO_PRIORIDAD.ALTA]: 'Alta',
    [REGISTRO_PRIORIDAD.MEDIA]: 'Media',
    [REGISTRO_PRIORIDAD.BAJA]: 'Baja'
  };
  const filterRegisters: RegistrosType[] = useMemo(() => {
    if (filterMode.isInEstado) {
      if (filterStados === REGISTRO_STATUS_SIN_ENTREGADO.ALL) return registros;
      else return registros.filter((r) => r.estado === (filterStados as unknown as typeof r.estado));
    }
    if (filterMode.isInDeliveryDate) {
      return registros.filter((r) => {
        const deliveryDate = DateUtils.parseStringToDate(r.deliverAt);
        return DateUtils.areDatesEqual(deliveryDate, deliveryFilterDate);
      });
    }
    if (filterMode.isInRequestDate) {
      return registros.filter((r) => {
        const requestDate = DateUtils.parseStringToDate(r.requestAt);
        return DateUtils.areDatesEqual(requestDate, requestFilterDate);
      });
    }
    if (filterMode.isInRangeDates) {
      return registros.filter((r) => {
        const requestDate = DateUtils.parseStringToDate(r.requestAt);
        return DateUtils.isDateInRange(
          dateRange.map((date) => DateUtils.formatDateToString(date ?? new Date())) as [string, string],
          requestDate
        );
      });
    }
    if (filterMode.isInPrioridad) return registros.filter((r) => r.prioridad === filterPrioridad);
    return registros;
  }, [
    dateRange,
    deliveryFilterDate,
    filterMode.isInDeliveryDate,
    filterMode.isInEstado,
    filterMode.isInPrioridad,
    filterMode.isInRangeDates,
    filterMode.isInRequestDate,
    filterPrioridad,
    filterStados,
    registros,
    requestFilterDate
  ]);
  const hasAnyFilterApply = useMemo(() => {
    return (
      filterMode.isInEstado ||
      filterMode.isInDeliveryDate ||
      filterMode.isInRequestDate ||
      filterMode.isInRangeDates ||
      filterMode.isInPrioridad
    );
  }, [
    filterMode.isInDeliveryDate,
    filterMode.isInEstado,
    filterMode.isInPrioridad,
    filterMode.isInRangeDates,
    filterMode.isInRequestDate
  ]);

  return (
    <Row>
      <Col className="d-flex align-content-center align-items-center justify-content-between py-1" xs={12}>
        <LoadRegistros checkRecords={checkRecords} onToggleCheck={toggleCheck} isLoading={isLoading} />
        <div className="d-flex align-items-center flex-wrap justify-content-end gap-1">
          <AgregarRegistros cliente={cliente} registerType={registerType} />
          <DeleteRegistros cliente={cliente} registerType={registerType} />
          <Button className="font-14 px-2" variant="outline-dark" onClick={pdfToggle}>
            <span className="d-none d-md-inline">PDF</span>
            <i className="d-inline d-md-none mdi mdi-file-pdf-box" />
          </Button>
          <Button className="font-14 px-2" variant="outline-dark" onClick={handleExportExcel}>
            <span className="d-none d-md-inline">Excel</span>
            <i className="d-inline d-md-none mdi mdi-microsoft-excel" />
          </Button>
          <Button disabled={isLoading} className="font-14 px-2" variant="outline-primary" onClick={refreashRegistros}>
            <i className="mdi mdi-autorenew" />
          </Button>
        </div>
      </Col>
      <Col xs={12}>
        <hr className="m-0 p-0" />
      </Col>
      <Col className="d-flex align-content-center align-items-center justify-content-between py-1" xs={12}>
        <Row className="m-0 p-0 w-100 column-gap-1 row-gap-1 justify-content-between">
          <Col xs="12" md="auto" className="d-flex justify-content-between align-items-center m-0 p-0">
            <label className="p-0 my-0 ms-0 me-1">Rango de fechas</label>
            <div className="w-auto">
              <DatepickerRange
                dateFormat="MMM d, yy"
                isRange={true}
                hideAddon={false}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(dates) => {
                  setFilterMode({
                    isInEstado: false,
                    isInDeliveryDate: false,
                    isInRequestDate: false,
                    isInRangeDates: true,
                    isInPrioridad: false
                  });
                  onDateChangeRange(dates);
                }}
              />
            </div>
          </Col>
          <Col xs="12" md="auto" className="d-flex justify-content-between align-items-center m-0 p-0">
            <label className="p-0 my-0 ms-0 me-1">Fecha de solicitud</label>
            <CustomDatePicker
              dateFormat="MMM d, yyyy"
              hideAddon={false}
              value={requestFilterDate}
              onChange={(date) => {
                setFilterMode({
                  isInEstado: false,
                  isInDeliveryDate: false,
                  isInRequestDate: true,
                  isInRangeDates: false,
                  isInPrioridad: false
                });
                setRequestFilterDate(date);
              }}
            />
          </Col>
          <Col xs="12" md="auto" className="d-flex justify-content-between align-items-center m-0 p-0">
            <label className="p-0 my-0 ms-0 me-1">Fecha de entrega</label>
            <CustomDatePicker
              dateFormat="MMM d, yyyy"
              hideAddon={false}
              value={deliveryFilterDate}
              onChange={(date) => {
                setFilterMode({
                  isInEstado: false,
                  isInDeliveryDate: true,
                  isInRequestDate: false,
                  isInRangeDates: false,
                  isInPrioridad: false
                });
                setDeliveryFilterDate(date);
              }}
            />
          </Col>
          <Col xs="12" md="auto" className="d-flex justify-content-between align-items-center m-0 p-0">
            <label className="p-0 my-0 ms-0 me-1">Prioridad</label>
            <Form.Select
              value={filterPrioridad}
              onChange={(e) => {
                setFilterMode({
                  isInEstado: false,
                  isInDeliveryDate: false,
                  isInRequestDate: false,
                  isInRangeDates: false,
                  isInPrioridad: true
                });
                setFilterPrioridad(e.target.value as REGISTRO_PRIORIDAD);
              }}>
              {Object.values(REGISTRO_PRIORIDAD)
                .map((p) => ({value: p, label: prioridadLabels[p]}))
                .map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </Form.Select>
          </Col>
          {checkRecords.checkPendingRecords && (
            <Col xs="12" md="auto" className="d-flex justify-content-between align-items-center m-0 p-0">
              <label className="p-0 my-0 ms-0 me-1">Estado</label>
              <Form.Select
                value={filterStados}
                onChange={(e) => {
                  setFilterMode({
                    isInEstado: true,
                    isInDeliveryDate: false,
                    isInRequestDate: false,
                    isInRangeDates: false,
                    isInPrioridad: false
                  });
                  setFilterStados(e.target.value as REGISTRO_STATUS_SIN_ENTREGADO);
                }}>
                {Object.values(REGISTRO_STATUS_SIN_ENTREGADO)
                  .map((p) => ({value: p, label: estadoLabels[p]}))
                  .map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          )}
          <Col xs="12" md="auto" className="d-flex justify-content-between align-items-center m-0 p-0">
            <Button
              variant="outline-light"
              className="font-14 px-2 w-100"
              disabled={!hasAnyFilterApply}
              onClick={() => {
                setFilterMode({
                  isInEstado: false,
                  isInDeliveryDate: false,
                  isInRequestDate: false,
                  isInRangeDates: false,
                  isInPrioridad: false
                });
                setRequestFilterDate(new Date());
                setDeliveryFilterDate(new Date());
                onDateChangeRange([new Date(), null]);
                setFilterStados(REGISTRO_STATUS_SIN_ENTREGADO.ALL);
                setFilterPrioridad(REGISTRO_PRIORIDAD.SINPRIORIDAD);
              }}>
              {hasAnyFilterApply ? 'Limpiar filtros' : 'Todos los registros'}
            </Button>
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        {isLoading ? (
          <SkeletonLoader customClass="p-0" height="50vh" />
        ) : (
          <ReactTable<RegistrosType>
            columns={registrosColumns}
            data={filterRegisters}
            pageSize={50}
            theadClass="table-light"
            showPagination
            isSearchable
            isSelectable
          />
        )}
        {registros.length > 0 && exportData.length > 0 && pdf && (
          <Row className="mt-2">
            <Col>
              <PDFViewer style={{width: '100%', height: '80vh'}}>
                <TablePdf<RegistrosType>
                  columns={registrosColumnsPdf}
                  data={exportData as RegistrosType[]}
                  title={`Reporte de registros - ${cliente} (${registerType})`}
                  orientation="landscape"
                />
              </PDFViewer>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
});

export {Registros};
