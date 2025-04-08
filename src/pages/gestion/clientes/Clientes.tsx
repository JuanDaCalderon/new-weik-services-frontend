import {PageBreadcrumb} from '@/components';
import {memo, useMemo} from 'react';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {TabContentItem} from '@/types';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {CrearCliente} from '@/pages/gestion/clientes/CrearCliente';
import {hasPermission} from '@/utils';
import {DEFAULT_HOME_ROUTER_PATH, PERMISOS_MAP_IDS, TABS_CLIENTES_CREAR, TABS_CLIENTES_LISTA} from '@/constants';
import {Link, Navigate} from 'react-router-dom';
import {ListaClientes} from './ListaClientes';
import {ToastWrapper} from '@/components/Toast';
import {useLocation} from 'react-router-dom';

const tabContents: TabContentItem[] = [
  {id: TABS_CLIENTES_CREAR, title: TABS_CLIENTES_CREAR},
  {id: TABS_CLIENTES_LISTA, title: TABS_CLIENTES_LISTA}
];

const Clientes = memo(function Clientes() {
  const {search} = useLocation();
  const queryParams = new URLSearchParams(search);
  const tabOption = queryParams.get('option') || TABS_CLIENTES_LISTA;
  const user = useAppSelector(selectUser);

  const canCrearClientes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearCliente, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const listContentOptions: TabContentItem[] = useMemo(() => {
    if (!canCrearClientes) return tabContents.filter((tab) => tab.id !== TABS_CLIENTES_CREAR);
    else return tabContents;
  }, [canCrearClientes]);

  if (
    !hasPermission(PERMISOS_MAP_IDS.accesoGestionClientes, user.roles, user.permisosOtorgados, user.permisosDenegados)
  ) {
    return <Navigate to={DEFAULT_HOME_ROUTER_PATH} replace />;
  }

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Gestión cliente" />
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
                          {tab.id === TABS_CLIENTES_CREAR && <CrearCliente />}
                          {tab.id === TABS_CLIENTES_LISTA && <ListaClientes />}
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

export {Clientes};
