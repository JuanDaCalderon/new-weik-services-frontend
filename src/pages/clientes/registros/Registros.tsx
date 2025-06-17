import {memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {useParams} from 'react-router-dom';
import {Registros as RegistrosType, RegistrosProps, Cliente} from '@/types';
import {selectClientes, selectRegistrosByClienteYTipo} from '@/store/selectores';
import {useSelector} from 'react-redux';
import {useLoadRegistros} from '@/pages/clientes/registros/hooks/useLoadRegistros';
import {LoadRegistros} from '@/pages/clientes/registros/components/LoadRegistros';
import {AgregarRegistros} from '@/pages/clientes/registros/components/AgregarRegistros';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useExpertExcel} from '@/pages/clientes/registros/hooks/useExpertExcel';
import {useGetColumns} from '@/pages/clientes/registros/hooks/useGetColumns';
import {DeleteRegistros} from '@/pages/clientes/registros/components/DeleteRegistros';
import {useRegistrosFilters} from '@/pages/clientes/registros/hooks/useRegistrosFilters';
import {PDFViewer} from '@react-pdf/renderer';
import {DatepickerRange, TablePdf, CustomDatePicker} from '@/components';
import {useAppSelector} from '@/store';
import {REGISTRO_PRIORIDAD, REGISTRO_STATUS_SIN_ENTREGADO} from '@/constants';
import {useTranslation} from 'react-i18next';

const Registros = memo(function Registros({registerType, customFields}: RegistrosProps) {
  /* Configuración del cliente */
  const {cliente} = useParams<{cliente: string}>();
  const clientes = useAppSelector(selectClientes);
  const {tiposRegistros} = useMemo(() => {
    return clientes.find((c) => c.domain === cliente) || ({tiposRegistros: []} as unknown as Cliente);
  }, [cliente, clientes]);
  const selectRegistros = useMemo(() => {
    if (!cliente) return null;
    return selectRegistrosByClienteYTipo(cliente, registerType);
  }, [cliente, registerType]);
  const {registros, isLoading} = useSelector(selectRegistros || (() => ({registros: [], isLoading: false})));
  /* States */
  const [pdf, setPdf] = useState<boolean>(false);
  /* Hooks */
  const {t} = useTranslation();
  const {
    hasAnyFilterApply,
    filterRegisters,
    dateRange,
    deliveryFilterDate,
    requestFilterDate,
    filterPrioridad,
    filterStados,
    applyFilterMode,
    onDateChangeRange,
    setDeliveryFilterDate,
    setFilterPrioridad,
    setFilterStados,
    setRequestFilterDate
  } = useRegistrosFilters(registros);
  const {checkRecords, toggleCheck, refreashRegistros} = useLoadRegistros(cliente, registerType, registros.length);
  const {exportData, handleExportExcel} = useExpertExcel(registros, tiposRegistros, registerType);
  const {registrosColumns, registrosColumnsPdf} = useGetColumns(tiposRegistros, registerType);

  /* Labels */
  const estadoLabels = {
    [REGISTRO_STATUS_SIN_ENTREGADO.ALL]: t('clientes.registros.filter.status.all'),
    [REGISTRO_STATUS_SIN_ENTREGADO.ENPROGRESO]: t('clientes.registros.filter.status.in_progress'),
    [REGISTRO_STATUS_SIN_ENTREGADO.PAUSA]: t('clientes.registros.filter.status.on_hold'),
    [REGISTRO_STATUS_SIN_ENTREGADO.COMPLETADO]: t('clientes.registros.filter.status.completed')
  };
  const prioridadLabels = {
    [REGISTRO_PRIORIDAD.SINPRIORIDAD]: t('clientes.registros.filter.priority.no_priority'),
    [REGISTRO_PRIORIDAD.ALTA]: t('clientes.registros.filter.priority.high'),
    [REGISTRO_PRIORIDAD.MEDIA]: t('clientes.registros.filter.priority.medium'),
    [REGISTRO_PRIORIDAD.BAJA]: t('clientes.registros.filter.priority.low')
  };

  /* Callbacks */
  const pdfToggle = useCallback(() => setPdf((prev) => !prev), []);

  return (
    <Row>
      <Col className="d-flex align-content-center align-items-center justify-content-between py-1" xs={12}>
        <LoadRegistros checkRecords={checkRecords} onToggleCheck={toggleCheck} isLoading={isLoading} />
        <div className="d-flex align-items-center flex-wrap justify-content-end gap-1">
          <AgregarRegistros cliente={cliente} registerType={registerType} customFields={customFields} />
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
                  applyFilterMode('isInRangeDates');
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
                applyFilterMode('isInRequestDate');
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
                applyFilterMode('isInDeliveryDate');
                setDeliveryFilterDate(date);
              }}
            />
          </Col>
          <Col xs="12" md="auto" className="d-flex justify-content-between align-items-center m-0 p-0">
            <label className="p-0 my-0 ms-0 me-1">Prioridad</label>
            <Form.Select
              value={filterPrioridad}
              onChange={(e) => {
                applyFilterMode('isInPrioridad');
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
                  applyFilterMode('isInEstado');
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
                applyFilterMode();
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
