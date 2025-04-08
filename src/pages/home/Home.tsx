import {PageBreadcrumb} from '@/components';
import HomeHeader from '@/components/HomeHeader';
import {TableroNoticias} from '@/components/Noticias';
import {ToastWrapper} from '@/components/Toast';
import {
  CLIENTES_MENU_KEY,
  GESTION_CLIENTES_MENU_KEY,
  GESTION_NOTICIAS_MENU_KEY,
  GESTION_OFICINA_HORARIOS_MENU_KEY,
  GESTION_OFICINA_REPORTES_MENU_KEY,
  GESTION_OFICINA_SOLICITUDES_MENU_KEY,
  GESTION_OFICINA_VACACIONES_MENU_KEY,
  GESTION_USUARIOS_MENU_KEY,
  ROLESYPERMISOS_MENU_KEY,
  TABS_CLIENTES_CREAR,
  TABS_USUARIOS_CREAR
} from '@/constants';
import {useGetClients, useRolesYPermisos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {permisosSelector, rolesSelector, selectClientes} from '@/store/selectores';
import {memo, useEffect} from 'react';
import {Card, Col, Dropdown, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';

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
    <ToastWrapper>
      <PageBreadcrumb title="Home" />

      <Row>
        <TableroNoticias />

        <Col>
          <Card>
            <Card.Header className="pb-0">
              <h4 className="header-title text-dark text-opacity-75 m-0">Home</h4>
            </Card.Header>
            <Card.Body>
              <HomeHeader />
              <Row>
                <Col className="d-flex justify-content-center gap-2 flex-column flex-xl-row" xs={12}>
                  <Dropdown>
                    <Dropdown.Toggle as={Link} to="#" className="btn btn-primary w-100">
                      <i className="mdi mdi-account-supervisor" />
                      Clientes
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {clientes.map((cliente, index) => {
                        return (
                          <Dropdown.Item as={Link} to={`${CLIENTES_MENU_KEY}/${cliente.domain}`} key={index}>
                            {cliente.nombre}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Link
                    to={`${GESTION_CLIENTES_MENU_KEY}?option=${TABS_CLIENTES_CREAR}`}
                    type="button"
                    className="btn btn-dark">
                    <i className="mdi mdi-account-multiple-plus" /> Agregar cliente
                  </Link>
                  <Link
                    to={`${GESTION_USUARIOS_MENU_KEY}?option=${TABS_USUARIOS_CREAR}`}
                    type="button"
                    className="btn btn-dark">
                    <i className="mdi mdi-account-box-multiple-outline" /> Agregar usuario
                  </Link>
                  <Link to={ROLESYPERMISOS_MENU_KEY} type="button" className="btn btn-dark">
                    <i className="mdi mdi-cog" /> Roles y permisos
                  </Link>
                  <Link to={GESTION_NOTICIAS_MENU_KEY} type="button" className="btn btn-dark">
                    <i className="mdi mdi-newspaper" /> Gestionar noticias
                  </Link>
                  <Link to={GESTION_OFICINA_HORARIOS_MENU_KEY} type="button" className="btn btn-dark">
                    <i className="mdi mdi-hours-24" /> Gestionar horarios
                  </Link>
                  <Link to={GESTION_OFICINA_VACACIONES_MENU_KEY} type="button" className="btn btn-dark">
                    <i className="mdi mdi-beach" /> Gestionar vacaciones
                  </Link>
                  <Link to={GESTION_OFICINA_REPORTES_MENU_KEY} type="button" className="btn btn-dark">
                    <i className="mdi mdi-chart-bar-stacked" /> Gestionar reportes
                  </Link>
                  <Link to={GESTION_OFICINA_SOLICITUDES_MENU_KEY} type="button" className="btn btn-dark">
                    <i className="mdi mdi-file-document-edit-outline" /> Gestionar solicitudes
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ToastWrapper>
  );
});

export {Home};
