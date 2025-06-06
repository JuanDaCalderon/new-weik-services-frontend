import {memo, useCallback, useMemo, useState} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {useParams} from 'react-router-dom';
import type {ColumnDef} from '@tanstack/react-table';
import {columns} from './Columnas';
import {Registros as RegistrosType, RegistrosProps, ExportColumn} from '@/types';
import {selectRegistrosByClienteYTipo} from '@/store/selectores';
import {useSelector} from 'react-redux';
import {useLoadRegistros} from '@/pages/clientes/registros/hooks/useLoadRegistros';
import {LoadRegistros} from '@/pages/clientes/registros/components/LoadRegistros';
import {AgregarRegistros} from '@/pages/clientes/registros/components/AgregarRegistros';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {useExportToExcel} from '@/hooks';
import {PDFViewer} from '@react-pdf/renderer';
import {TablePdf} from '@/components';
import {DeleteRegistros} from './components/DeleteRegistros';

const registrosColumnsPdf: ExportColumn<RegistrosType>[] = [
  {field: 'requestAt', header: 'Fecha de solicitud'},
  {field: 'deliverAt', header: 'Fecha de entrega'},
  {field: 'nombre', header: 'Nombre del proyecto'},
  {field: 'cliente', header: 'Cliente'},
  {field: 'solicitante', header: 'Solicitante'},
  {field: 'numeroOrden', header: 'Número de orden'},
  {field: 'prioridad', header: 'Prioridad'},
  {field: 'encargado', header: 'Encargado'},
  {field: 'estado', header: 'Estado'}
];

const Registros = memo(function Registros({registerType}: RegistrosProps) {
  const [pdf, setPdf] = useState<boolean>(false);
  const [thisColumns] = useState<ColumnDef<RegistrosType>[]>(() => [...columns]);
  const {cliente} = useParams<{cliente: string}>();
  const selectRegistros = useMemo(() => {
    if (!cliente) return null;
    return selectRegistrosByClienteYTipo(cliente, registerType);
  }, [cliente, registerType]);
  const {registros, isLoading} = useSelector(selectRegistros || (() => ({registros: [], isLoading: false})));
  const {checkRecords, toggleCheck, refreashRegistros} = useLoadRegistros(cliente, registerType, registros.length);
  const {exportToExcel} = useExportToExcel<RegistrosType>();
  const pdfToggle = useCallback(() => setPdf((prev) => !prev), []);

  const exportData = useMemo(() => {
    return registros.map((registro) => ({
      requestAt: registro.requestAt,
      deliverAt: registro.deliverAt,
      nombre: registro.nombre,
      cliente: registro.cliente,
      solicitante: registro.solicitante,
      numeroOrden: registro.numeroOrden,
      prioridad: registro.prioridad,
      encargado: registro.encargado,
      estado: registro.estado
    }));
  }, [registros]);

  const handleExportExcel = useCallback(() => {
    return exportToExcel(exportData as RegistrosType[], registrosColumnsPdf, 'Reporte');
  }, [exportData, exportToExcel]);

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
        {isLoading ? (
          <SkeletonLoader customClass="p-0" height="50vh" />
        ) : (
          <ReactTable<RegistrosType>
            columns={thisColumns}
            data={registros}
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
