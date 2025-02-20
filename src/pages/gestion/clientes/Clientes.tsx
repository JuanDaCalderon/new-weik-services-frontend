import {PageBreadcrumb} from '@/components';
import ReactTable from '@/components/table/ReactTable';
import {memo, useEffect, useMemo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {columns} from './Columnas';
import {Cliente} from '@/types';
import {useAppSelector} from '@/store';
import {selectClientes, isLoadingClientes, selectUser} from '@/store/selectores';
import {Toaster} from 'react-hot-toast';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {CrearCliente} from '@/pages/gestion/clientes/CrearCliente';
import {useGetClients} from '@/endpoints';
import {hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS, TOAST_DURATION} from '@/constants';
import {Navigate} from 'react-router-dom';

const Clientes = memo(function Clientes() {
  const user = useAppSelector(selectUser);
  const {getClientesSync} = useGetClients();
  const clientes = useAppSelector(selectClientes);
  const isLoadingClients = useAppSelector(isLoadingClientes);

  useEffect(() => {
    if (clientes.length <= 0) getClientesSync();
  }, [clientes.length, getClientesSync]);

  const canCrearClientes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearCliente, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  if (
    !hasPermission(PERMISOS_MAP_IDS.accesoGestionClientes, user.roles, user.permisosOtorgados, user.permisosDenegados)
  ) {
    return <Navigate to="/services/dashboard" replace />;
  }

  return (
    <>
      <PageBreadcrumb title="Gestión cliente" />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                {canCrearClientes ? (
                  <>
                    <Col sm={12} lg={4} xl={3} className="mb-3 mb-lg-0">
                      {!isLoadingClients ? <CrearCliente /> : <SkeletonLoader height="300px" customClass="p-0" />}
                    </Col>
                    <Col sm={12} lg={8} xl={9}>
                      <Card.Header className="p-0">
                        <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Clientes</h4>
                      </Card.Header>
                      {!isLoadingClients ? (
                        <ReactTable<Cliente>
                          columns={columns}
                          data={clientes}
                          pageSize={10}
                          tableClass="table-striped"
                          showPagination
                        />
                      ) : (
                        <SkeletonLoader height="100%" customClass="px-0" />
                      )}
                    </Col>
                  </>
                ) : (
                  <Col sm={12}>
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
                      <SkeletonLoader height="100%" customClass="px-0" />
                    )}
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: TOAST_DURATION,
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
