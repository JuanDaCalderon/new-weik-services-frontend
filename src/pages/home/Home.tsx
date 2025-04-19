import {PageBreadcrumb} from '@/components';
import HomeHeader from '@/components/HomeHeader';
import {TableroNoticias} from '@/components/Noticias';
import {ToastWrapper} from '@/components/Toast';
import {
  CLIENTES_MENU_KEY,
  GESTION_CLIENTES_MENU_KEY,
  GESTION_NOTICIAS_MENU_KEY,
  GESTION_OFICINA_CALENDARIO_MENU_KEY,
  GESTION_OFICINA_REPORTES_MENU_KEY,
  GESTION_OFICINA_SOLICITUDES_MENU_KEY,
  GESTION_OFICINA_VACACIONES_MENU_KEY,
  GESTION_USUARIOS_MENU_KEY,
  PERMISOS_MAP_IDS,
  ROLESYPERMISOS_MENU_KEY,
  TABS_CLIENTES_CREAR,
  TABS_USUARIOS_CREAR
} from '@/constants';
import {useGetClients, useRolesYPermisos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {permisosSelector, rolesSelector, selectClientes, selectUser} from '@/store/selectores';
import {hasPermission} from '@/utils';
import {memo, useEffect, useMemo} from 'react';
import {Card, Col, Dropdown, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const Home = memo(function Home() {
  const {getRolesSync, getPermisosSync} = useRolesYPermisos();
  const {getClientesSync} = useGetClients();
  const clientes = useAppSelector(selectClientes);
  const roles = useAppSelector(rolesSelector);
  const permisos = useAppSelector(permisosSelector);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (clientes.length <= 0) getClientesSync();
  }, [clientes.length, getClientesSync]);

  useEffect(() => {
    if (roles.length <= 0) getRolesSync();
  }, [roles.length, getRolesSync]);

  useEffect(() => {
    if (permisos.length <= 0) getPermisosSync();
  }, [permisos.length, getPermisosSync]);

  const canCrearClientes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearClientes, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canCrearUsuarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearUsuarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoRoles = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoRoles, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoNoticias = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoNoticias, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoCalendario = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoCalendario, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoVacaciones = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoVacaciones, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoReportes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoReportes, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoSolicitudes = useMemo(() => {
    return hasPermission(
      PERMISOS_MAP_IDS.accesoSolicitudes,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Home" />

      <Row>
        <TableroNoticias />

        <Col className="px-0 px-lg-2">
          <Card>
            <Card.Header className="pb-0">
              <h4 className="header-title text-dark text-opacity-75 m-0">Home</h4>
            </Card.Header>
            <Card.Body>
              <HomeHeader />
              <Row>
                <Col className="d-flex justify-content-center gap-2 flex-column flex-xxl-row" xs={12}>
                  <Dropdown>
                    <Dropdown.Toggle as={Link} to="#" className="btn btn-sm btn-primary w-100">
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
                  {canCrearClientes && (
                    <Link
                      to={`${GESTION_CLIENTES_MENU_KEY}?option=${TABS_CLIENTES_CREAR}`}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-account-multiple-plus" /> Crear cliente
                    </Link>
                  )}
                  {canCrearUsuarios && (
                    <Link
                      to={`${GESTION_USUARIOS_MENU_KEY}?option=${TABS_USUARIOS_CREAR}`}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-account-box-multiple-outline" /> Crear usuario
                    </Link>
                  )}
                  {canAccesoRoles && (
                    <Link
                      to={ROLESYPERMISOS_MENU_KEY}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-cog" /> Roles y permisos
                    </Link>
                  )}
                  {canAccesoNoticias && (
                    <Link
                      to={GESTION_NOTICIAS_MENU_KEY}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-newspaper" /> Noticias
                    </Link>
                  )}
                  {canAccesoCalendario && (
                    <Link
                      to={GESTION_OFICINA_CALENDARIO_MENU_KEY}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-hours-24" /> Calendario
                    </Link>
                  )}
                  {canAccesoVacaciones && (
                    <Link
                      to={GESTION_OFICINA_VACACIONES_MENU_KEY}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-beach" /> Vacaciones
                    </Link>
                  )}
                  {canAccesoReportes && (
                    <Link
                      to={GESTION_OFICINA_REPORTES_MENU_KEY}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-chart-bar-stacked" /> Reportes
                    </Link>
                  )}
                  {canAccesoSolicitudes && (
                    <Link
                      to={GESTION_OFICINA_SOLICITUDES_MENU_KEY}
                      type="button"
                      className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                      <i className="mdi mdi-file-document-edit-outline" /> Solicitudes
                    </Link>
                  )}
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
