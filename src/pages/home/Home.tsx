import {PageBreadcrumb} from '@/components';
import {Dashboard} from '@/components/Dashboard';
import HomeHeader from '@/components/HomeHeader';
import {TableroNoticias} from '@/components/Noticias';
import {ToastWrapper} from '@/components/Toast';
import {
  CLIENTES_ROUTER_PATH,
  GESTION_CLIENTES_ROUTER_PATH,
  GESTION_NOTICIAS_ROUTER_PATH,
  GESTION_OFICINA_EVENTOS_ROUTER_PATH,
  GESTION_OFICINA_HORARIOS_ROUTER_PATH,
  GESTION_OFICINA_REPORTES_ROUTER_PATH,
  GESTION_OFICINA_VACACIONES_ROUTER_PATH,
  GESTION_USUARIOS_ROUTER_PATH,
  PERMISOS_MAP_IDS,
  ROLES_ROUTER_PATH,
  TABS_CLIENTES_ID_CREAR,
  TABS_USUARIOS_ID_CREAR
} from '@/constants';
import {useGetClients, useRolesYPermisos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {permisosSelector, rolesSelector, selectClientes, selectUser} from '@/store/selectores';
import {hasPermission} from '@/utils';
import {memo, useEffect, useMemo} from 'react';
import {Card, Col, Dropdown, Row} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

const Home = memo(function Home() {
  const {getRolesSync, getPermisosSync} = useRolesYPermisos();
  const {getClientesSync} = useGetClients();
  const clientes = useAppSelector(selectClientes);
  const roles = useAppSelector(rolesSelector);
  const permisos = useAppSelector(permisosSelector);
  const user = useAppSelector(selectUser);
  const {t} = useTranslation();

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

  const canAccesoHorarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoHorarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoEventos = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoEventos, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoVacaciones = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoVacaciones, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const canAccesoReportes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.accesoReportes, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title={t('home.title')} />

      <Row>
        <TableroNoticias />

        <Col>
          <Dashboard applyMobilePadding></Dashboard>
          <Row>
            <Col className="px-0 px-xl-2">
              <Card>
                <Card.Header className="pb-0">
                  <h4 className="header-title text-dark text-opacity-75 m-0">{t('home.title')}</h4>
                </Card.Header>
                <Card.Body>
                  <HomeHeader />
                  <Row>
                    <Col className="d-flex justify-content-center gap-2 flex-column flex-xxl-row" xs={12}>
                      <Dropdown>
                        <Dropdown.Toggle as={Link} to="#" className="btn btn-sm btn-primary w-100">
                          <i className="mdi mdi-account-supervisor" />
                          {t('home.clients')}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {clientes.map((cliente, index) => {
                            return (
                              <Dropdown.Item as={Link} to={`${CLIENTES_ROUTER_PATH}/${cliente.domain}`} key={index}>
                                {cliente.nombre}
                              </Dropdown.Item>
                            );
                          })}
                        </Dropdown.Menu>
                      </Dropdown>
                      {canCrearClientes && (
                        <Link
                          to={`${GESTION_CLIENTES_ROUTER_PATH}?option=${TABS_CLIENTES_ID_CREAR}`}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-account-multiple-plus" /> {t('home.crear_clients')}
                        </Link>
                      )}
                      {canCrearUsuarios && (
                        <Link
                          to={`${GESTION_USUARIOS_ROUTER_PATH}?option=${TABS_USUARIOS_ID_CREAR}`}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-account-box-multiple-outline" /> {t('home.crear_user')}
                        </Link>
                      )}
                      {canAccesoRoles && (
                        <Link
                          to={ROLES_ROUTER_PATH}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-cog" /> {t('home.crear_roles_permisos')}
                        </Link>
                      )}
                      {canAccesoNoticias && (
                        <Link
                          to={GESTION_NOTICIAS_ROUTER_PATH}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-newspaper" /> {t('home.news')}
                        </Link>
                      )}
                      {canAccesoHorarios && (
                        <Link
                          to={GESTION_OFICINA_HORARIOS_ROUTER_PATH}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-hours-24" /> {t('home.schedule')}
                        </Link>
                      )}
                      {canAccesoEventos && (
                        <Link
                          to={GESTION_OFICINA_EVENTOS_ROUTER_PATH}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-calendar-multiselect" /> {t('home.events')}
                        </Link>
                      )}
                      {canAccesoVacaciones && (
                        <Link
                          to={GESTION_OFICINA_VACACIONES_ROUTER_PATH}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-beach" /> {t('home.vacations')}
                        </Link>
                      )}
                      {canAccesoReportes && (
                        <Link
                          to={GESTION_OFICINA_REPORTES_ROUTER_PATH}
                          type="button"
                          className="btn btn-sm btn-dark d-flex align-items-center justify-content-center">
                          <i className="mdi mdi-chart-bar-stacked" /> {t('home.reports')}
                        </Link>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </ToastWrapper>
  );
});

export {Home};
