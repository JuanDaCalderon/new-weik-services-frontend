import {TabContentItem} from '@/types';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Horario} from './Horario';
import {Vacaciones} from './Vacaciones';

const HubLaboral = () => {
  const tabContents: TabContentItem[] = [
    {id: 'Horario', title: 'Horario'},
    {id: 'Vacaciones', title: 'Vacaciones'}
  ];

  return (
    <Card>
      <Card.Body>
        <Tab.Container defaultActiveKey="Horario">
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
                    {tab.id === 'Horario' && <Horario />}
                    {tab.id === 'Vacaciones' && <Vacaciones />}
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

export {HubLaboral};
