import {memo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import ClientesRegistros from './ClientesRegistros';

const Dashboard = memo(function Dashboard({applyMobilePadding = false}: {applyMobilePadding?: boolean}) {
  return (
    <Row>
      <Col xs={12} className={applyMobilePadding ? 'px-0 px-xl-2' : ''}>
        <Card className="widget-inline mb-2">
          <Card.Body className="p-0">
            <Row className="g-0">
              <Col xs={12} sm={12}>
                <ClientesRegistros></ClientesRegistros>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
});

export {Dashboard};
