import {Row, Col, Card, Tab, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {PageBreadcrumb} from '@/components';
import {memo} from 'react';
import {TabContentItem} from '@/types';
import {Roles} from './Roles';
import {Usuarios} from './Usuarios';

const RolesYPermisos = memo(function RolesYPermisos() {
  const tabContents: TabContentItem[] = [
    {id: 'Roles', title: 'Roles'},
    {id: 'Usuarios', title: 'Usuarios'}
  ];

  return (
    <>
      <PageBreadcrumb title="Roles y Permisos" />
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey="Roles">
              <Col xs={12} md={2} xl={1}>
                <Nav variant="pills" className="flex-column">
                  {tabContents.map((tab, index) => (
                    <Nav.Item key={index}>
                      <Nav.Link as={Link} to="#" eventKey={tab.id}>
                        {tab.title}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col xs={12} md={10} xl={11}>
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
    </>
  );
});

export {RolesYPermisos};
