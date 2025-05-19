import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Calendario} from './Calendario';
import {TabContentItem} from '@/types';
import {MisObjetivos} from './MisObjetivos';

const HubLaboral = () => {
  const tabContents: TabContentItem[] = [
    {id: 'Calendario', title: 'Calendario'},
    {id: 'Objetivos', title: 'Objetivos'}
  ];
  return (
    <>
      <Card>
        <Card.Body id="user-calendar-objetivos">
          <Tab.Container defaultActiveKey="Calendario">
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
                      {tab.id === 'Calendario' && <Calendario />}
                      {tab.id === 'Objetivos' && <MisObjetivos />}
                    </Col>
                  </Row>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </>
  );
};

export {HubLaboral};
