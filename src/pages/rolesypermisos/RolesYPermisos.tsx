import {Row, Col, Card, Tab, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {PageBreadcrumb} from '@/components';
import {memo, useEffect} from 'react';
import {TabContentItem} from '@/types';
import {Usuarios} from './usuarios/Usuarios';
import {useGetEmployees} from '@/endpoints';
import Roles from './roles';
import {Toaster} from 'react-hot-toast';
import {RolesUsuariosProvider} from './context';

const tabContents: TabContentItem[] = [
  {id: 'Roles', title: 'Roles'},
  {id: 'Usuarios', title: 'Usuarios'}
];

const RolesYPermisos = memo(function RolesYPermisos() {
  const {getEmployeesListener} = useGetEmployees();

  useEffect(() => {
    const employeesUnsubscribe = getEmployeesListener();
    return () => {
      employeesUnsubscribe();
    };
  }, [getEmployeesListener]);

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
                          {tab.id === 'Usuarios' && <Usuarios />}
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
