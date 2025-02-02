import {PageBreadcrumb} from '@/components';
import ReactTable from '@/components/table/ReactTable';
import {memo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {columns} from './Columnas';
import {Cliente} from '@/types';
import {useAppSelector} from '@/store';
import {selectClientes, isLoadingClientes} from '@/store/selectores';
import {Toaster} from 'react-hot-toast';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {CrearCliente} from '@/pages/gestion/clientes/CrearCliente';

const Clientes = memo(function Clientes() {
  const clientes = useAppSelector(selectClientes);
  const isLoadingClients = useAppSelector(isLoadingClientes);

  return (
    <>
      <PageBreadcrumb title="Gestión cliente" />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col sm={12} lg={4} xl={3} xxl={2} className="mb-3 mb-lg-0">
                  <CrearCliente />
                </Col>
                <Col sm={12} lg={8} xl={9} xxl={10}>
                  <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Clientes</h4>
                  {!isLoadingClients ? (
                    <ReactTable<Cliente>
                      columns={columns}
                      data={clientes}
                      pageSize={10}
                      tableClass="table-striped"
                      showPagination
                    />
                  ) : (
                    <SkeletonLoader height="200px" customClass="px-1" />
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
});

export {Clientes};
