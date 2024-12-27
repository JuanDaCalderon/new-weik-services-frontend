import {memo} from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {MemoizedRenderSubComponent} from './SubComponentUsuarios';
import {thisUsuarios} from '@/types';
import useUsuarios from './useUsuarios';
import {usuariosColumns} from './columnas';

const Usuarios = memo(function Usuarios() {
  const {usuarios} = useUsuarios();
  return (
    <>
      <hr className="d-md-none" />
      <Row className="d-flex align-content-center align-items-center">
        <Col xs="auto" className="me-auto">
          <h4 className="header-title text-dark m-0">Gestión de permisos por usuarios</h4>
        </Col>
        <Col xs="auto" className="ms-auto">
          <Button className="w-100 shadow-sm" variant="success">
            <i className="mdi mdi-account-multiple-plus" /> Crear Usuario
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ReactTable<thisUsuarios>
            theadClass="table-light"
            searchBoxClass="my-2"
            columns={usuariosColumns}
            data={usuarios}
            showPagination
            isSearchable={true}
            getRowCanExpand={() => true}
            renderSubComponent={(props) => <MemoizedRenderSubComponent {...props} />}
          />
        </Col>
      </Row>
    </>
  );
});

export {Usuarios};
