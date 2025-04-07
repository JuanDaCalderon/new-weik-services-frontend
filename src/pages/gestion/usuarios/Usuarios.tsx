import {PageBreadcrumb} from '@/components';
import {memo, useMemo} from 'react';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {TabContentItem} from '@/types';
import {useAppSelector} from '@/store';
import {selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {Toaster} from 'react-hot-toast';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {CrearUsuarios} from '@/pages/gestion/usuarios/CrearUsuarios';
import {hasPermission} from '@/utils';
import {
  DEFAULT_HOME_ROUTER_PATH,
  PERMISOS_MAP_IDS,
  TABS_USUARIOS_CREAR,
  TABS_USUARIOS_LISTA,
  TOAST_DURATION
} from '@/constants';
import {Link, Navigate} from 'react-router-dom';
import {ListaUsuarios} from './ListaUsuarios';

const tabContents: TabContentItem[] = [
  {id: TABS_USUARIOS_CREAR, title: TABS_USUARIOS_CREAR},
  {id: TABS_USUARIOS_LISTA, title: TABS_USUARIOS_LISTA}
];

const Usuarios = memo(function Usuarios() {
  const user = useAppSelector(selectUser);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);

  const canCrearUsuarios = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearUsuario, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const listContentOptions: TabContentItem[] = useMemo(() => {
    if (!canCrearUsuarios) return tabContents.filter((tab) => tab.id !== TABS_USUARIOS_CREAR);
    else return tabContents;
  }, [canCrearUsuarios]);

  if (
    !hasPermission(PERMISOS_MAP_IDS.accesoGestionUsuarios, user.roles, user.permisosOtorgados, user.permisosDenegados)
  ) {
    return <Navigate to={DEFAULT_HOME_ROUTER_PATH} replace />;
  }

  return (
    <>
      <PageBreadcrumb title="Gestión usuarios" />

      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey={TABS_USUARIOS_LISTA}>
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
                          {tab.id === TABS_USUARIOS_CREAR &&
                            (!isLoadingUsers ? <CrearUsuarios /> : <SkeletonLoader height="500px" customClass="p-0" />)}
                          {tab.id === TABS_USUARIOS_LISTA &&
                            (!isLoadingUsers ? <ListaUsuarios /> : <SkeletonLoader height="500px" customClass="p-0" />)}
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

export {Usuarios};
