import {PageBreadcrumb} from '@/components';
import {memo, useMemo} from 'react';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {TabContentItem} from '@/types';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {CrearUsuarios} from '@/pages/gestion/usuarios/CrearUsuarios';
import {hasPermission} from '@/utils';
import {HOME_ROUTER_PATH, PERMISOS_MAP_IDS, TABS_USUARIOS_ID_CREAR, TABS_USUARIOS_ID_LISTA} from '@/constants';
import {Link, Navigate, useLocation} from 'react-router-dom';
import {ListaUsuarios} from './ListaUsuarios';
import {ToastWrapper} from '@/components/Toast';
import {useTranslation} from 'react-i18next';

const Usuarios = memo(function Usuarios() {
  const {search} = useLocation();
  const {t} = useTranslation();
  const queryParams = new URLSearchParams(search);
  const tabOption = queryParams.get('option') || TABS_USUARIOS_ID_LISTA;
  const user = useAppSelector(selectUser);

  const tabContents: TabContentItem[] = useMemo(() => {
    return [
      {id: TABS_USUARIOS_ID_CREAR, title: t('gestion.usuarios.crear')},
      {id: TABS_USUARIOS_ID_LISTA, title: t('gestion.usuarios.lista')}
    ];
  }, [t]);

  const canCrearUsuarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearUsuarios, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const listContentOptions: TabContentItem[] = useMemo(() => {
    if (!canCrearUsuarios) return tabContents.filter((tab) => tab.id !== TABS_USUARIOS_ID_CREAR);
    else return tabContents;
  }, [canCrearUsuarios, tabContents]);

  if (!hasPermission(PERMISOS_MAP_IDS.accesoUsuarios, user.roles, user.permisosOtorgados, user.permisosDenegados)) {
    return <Navigate to={HOME_ROUTER_PATH} replace />;
  }

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Gestión usuarios" />
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey={tabOption}>
              <Col xs={12} md={2} xxl={1}>
                <Nav variant="pills" className="flex-column bg-light bg-gradient bg-opacity-50 rounded">
                  {listContentOptions.map((tab, index) => (
                    <Nav.Item className="w-100" key={index}>
                      <Nav.Link as={Link} to="#" eventKey={tab.id}>
                        {tab.title}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col xs={12} md={10} xxl={11} className="mt-2 mt-md-0">
                <Tab.Content>
                  {listContentOptions.map((tab, index) => (
                    <Tab.Pane eventKey={tab.id} key={index}>
                      <Row>
                        <Col sm={12}>
                          {tab.id === TABS_USUARIOS_ID_CREAR && <CrearUsuarios />}
                          {tab.id === TABS_USUARIOS_ID_LISTA && <ListaUsuarios />}
                        </Col>
                      </Row>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Tab.Container>
          </Row>
        </Card.Body>
      </Card>
    </ToastWrapper>
  );
});

export {Usuarios};
