import {PageBreadcrumb} from '@/components';
import {memo, useMemo} from 'react';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {TabContentItem} from '@/types';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {CrearCliente} from '@/pages/gestion/clientes/CrearCliente';
import {hasPermission} from '@/utils';
import {HOME_ROUTER_PATH, PERMISOS_MAP_IDS, TABS_CLIENTES_ID_CREAR, TABS_CLIENTES_ID_LISTA} from '@/constants';
import {Link, Navigate} from 'react-router-dom';
import {ListaClientes} from './ListaClientes';
import {ToastWrapper} from '@/components/Toast';
import {useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const Clientes = memo(function Clientes() {
  const {search} = useLocation();
  const queryParams = new URLSearchParams(search);
  const tabOption = queryParams.get('option') || TABS_CLIENTES_ID_LISTA;
  const user = useAppSelector(selectUser);
  const {t} = useTranslation();

  const tabContents: TabContentItem[] = useMemo(() => {
    return [
      {id: TABS_CLIENTES_ID_CREAR, title: t('gestion.clientes.crear')},
      {id: TABS_CLIENTES_ID_LISTA, title: t('gestion.clientes.lista')}
    ];
  }, [t]);

  const canCrearClientes = useMemo(() => {
    return hasPermission(PERMISOS_MAP_IDS.crearClientes, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  const listContentOptions: TabContentItem[] = useMemo(() => {
    if (!canCrearClientes) return tabContents.filter((tab) => tab.id !== TABS_CLIENTES_ID_CREAR);
    else return tabContents;
  }, [canCrearClientes, tabContents]);

  if (!hasPermission(PERMISOS_MAP_IDS.accesoClientes, user.roles, user.permisosOtorgados, user.permisosDenegados)) {
    return <Navigate to={HOME_ROUTER_PATH} replace />;
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
                          {tab.id === TABS_CLIENTES_ID_CREAR && <CrearCliente />}
                          {tab.id === TABS_CLIENTES_ID_LISTA && <ListaClientes />}
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
