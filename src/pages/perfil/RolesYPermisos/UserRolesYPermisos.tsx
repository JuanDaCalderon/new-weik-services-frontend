import {TabContentItem} from '@/types';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Roles} from './Roles';
import {Permisos} from './Permisos';

const UserRolesYPermisos = () => {
  const tabContents: TabContentItem[] = [
    {id: 'Roles', title: 'Roles'},
    {id: 'Permisos', title: 'Permisos'}
  ];

  return (
    <Card>
      <Card.Body id="user-roles-permisos">
        <Tab.Container defaultActiveKey="Roles">
          <Nav variant="tabs">
            {tabContents.map((tab, index) => (
              <Nav.Item key={index}>
                <Nav.Link as={Link} to="#" eventKey={tab.title}>
                  <span>{tab.title}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            {tabContents.map((tab, index) => (
              <Tab.Pane eventKey={tab.title} id={tab.id} key={index}>
                <Row>
                  <Col sm="12">
                    {tab.id === 'Roles' && <Roles />}
                    {tab.id === 'Permisos' && <Permisos />}
                  </Col>
                </Row>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export {UserRolesYPermisos};
