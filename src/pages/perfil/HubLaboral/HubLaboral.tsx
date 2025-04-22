import {Card, Col, Row} from 'react-bootstrap';
import {Calendario} from './Calendario';

const HubLaboral = () => {
  return (
    <Card>
      <Card.Body>
        <Row>
          <Col sm="12">
            <Calendario />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export {HubLaboral};
