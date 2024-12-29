import {Row, Col, Card, Tab, Nav} from 'react-bootstrap';
import {Link, Navigate} from 'react-router-dom';
import {PageBreadcrumb} from '@/components';
import {memo, useEffect} from 'react';
import {TabContentItem} from '@/types';
import {Usuarios} from './usuarios/Usuarios';
import {useGetEmployees, useRolesYPermisos} from '@/endpoints';
import Roles from './roles';
import {Toaster} from 'react-hot-toast';
import {RolesUsuariosProvider} from './context';
import {useAppSelector} from '@/store';
import {selectisLoadingEmployees} from '@/store/selectores/users';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {selectUser} from '@/store/selectores';
import {hasPermission} from '@/utils';
import {PERMISOS_MAP_IDS} from '@/constants';

const tabContents: TabContentItem[] = [
  {id: 'Roles', title: 'Roles'},
  {id: 'Usuarios', title: 'Usuarios'}
];

const RolesYPermisos = memo(function RolesYPermisos() {
  const {getPermisosListener, getRolesListener} = useRolesYPermisos();
  const {getEmployeesListener} = useGetEmployees();
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const employeesUnsubscribe = getEmployeesListener();
    const rolesUnsubscribe = getRolesListener();
    const permisosUnsubscribe = getPermisosListener();
    return () => {
      employeesUnsubscribe();
      rolesUnsubscribe();
      permisosUnsubscribe();
    };
  }, [getEmployeesListener, getPermisosListener, getRolesListener]);

  if (
    !hasPermission(
      PERMISOS_MAP_IDS.accesoRolesPermisos,
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    )
  ) {
    return <Navigate to="/services/dashboard" replace />;
  }

  return (
    <RolesUsuariosProvider>
      <PageBreadcrumb title="Roles y Permisos" />
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey="Roles">
              <Col xs={12} md={2} xxl={1}>
                <Nav
                  variant="pills"
                  className="flex-column bg-light bg-gradient bg-opacity-50 rounded">
                  {tabContents.map((tab, index) => (
                    <Nav.Item className="w-100" key={index}>
                      <Nav.Link as={Link} to="#" eventKey={tab.id}>
                        {tab.title}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col xs={12} md={10} xxl={11}>
                <Tab.Content>
                  {tabContents.map((tab, index) => (
                    <Tab.Pane eventKey={tab.id} key={index}>
                      <Row>
                        <Col sm="12">
                          {tab.id === 'Roles' && <Roles />}
                          {tab.id === 'Usuarios' && (
                            <>
                              {!isLoadingUsers ? (
                                <Usuarios />
                              ) : (
                                <SkeletonLoader height="125px"></SkeletonLoader>
                              )}
                            </>
                          )}
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
          duration: 5000,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </RolesUsuariosProvider>
  );
});

export {RolesYPermisos};
