import {memo, useMemo} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {useParams} from 'react-router-dom';
import {columns} from './Columnas';
import {Registros as RegistrosType, RegistrosProps} from '@/types';
import {selectRegistrosByClienteYTipo} from '@/store/selectores';
import {useSelector} from 'react-redux';
import {useLoadRegistros} from '@/pages/clientes/registros/hooks/useLoadRegistros';
import {LoadRegistros} from '@/pages/clientes/registros/components/LoadRegistros';
import {AgregarRegistros} from '@/pages/clientes/registros/components/AgregarRegistros';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const Registros = memo(function Registros({registerType}: RegistrosProps) {
  const {cliente} = useParams<{cliente: string}>();
  const selectRegistros = useMemo(() => {
    if (!cliente) return null;
    return selectRegistrosByClienteYTipo(cliente, registerType);
  }, [cliente, registerType]);
  const {registros, isLoading} = useSelector(selectRegistros || (() => ({registros: [], isLoading: false})));
  const {checkRecords, toggleCheck, refreashRegistros} = useLoadRegistros(cliente, registerType, registros.length);

  return (
    <Row>
      <Col className="d-flex align-content-center align-items-center justify-content-between py-1" xs={12}>
        <LoadRegistros checkRecords={checkRecords} onToggleCheck={toggleCheck} isLoading={isLoading} />
        <div className="d-flex align-items-center flex-wrap justify-content-end gap-1">
          <AgregarRegistros cliente={cliente} registerType={registerType} />
          <Button
            className="font-14 px-2"
            variant="outline-danger"
            onClick={() => console.log('Eliminar registros seleccionados')}>
            <span className="d-none d-md-inline">Eliminar</span>
            <i className="d-inline d-md-none mdi mdi-delete-outline" />
          </Button>
          <Button
            className="font-14 px-2"
            variant="outline-dark"
            onClick={() => {
              console.log('Exportar a PDF');
            }}>
            <span className="d-none d-md-inline">PDF</span>
            <i className="d-inline d-md-none mdi mdi-file-pdf-box" />
          </Button>
          <Button
            className="font-14 px-2"
            variant="outline-dark"
            onClick={() => {
              console.log('Exportar a ExcelF');
            }}>
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
            columns={columns}
            data={registros}
            pageSize={50}
            tableClass="table-striped"
            showPagination
            isSearchable
            isSelectable
          />
        )}
      </Col>
    </Row>
  );
});

export {Registros};
