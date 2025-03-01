import {PageBreadcrumb} from '@/components';
import {TableroNoticias} from '@/components/Noticias';
import {TOAST_DURATION} from '@/constants';
import {useGetClients, useRolesYPermisos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {permisosSelector, rolesSelector, selectClientes} from '@/store/selectores';
import {memo, useEffect} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Toaster} from 'react-hot-toast';

const Home = memo(function Home() {
  const {getRolesSync, getPermisosSync} = useRolesYPermisos();
  const {getClientesSync} = useGetClients();
  const clientes = useAppSelector(selectClientes);
  const roles = useAppSelector(rolesSelector);
  const permisos = useAppSelector(permisosSelector);

  useEffect(() => {
    if (clientes.length <= 0) getClientesSync();
  }, [clientes.length, getClientesSync]);

  useEffect(() => {
    if (roles.length <= 0) getRolesSync();
  }, [roles.length, getRolesSync]);

  useEffect(() => {
    if (permisos.length <= 0) getPermisosSync();
  }, [permisos.length, getPermisosSync]);

  return (
    <>
      <PageBreadcrumb title="Home" />

      <Row>
        <TableroNoticias />

        <Col>
          <Card>
            <Card.Body>
              <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Home</h4>
              Home
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

export {Home};
