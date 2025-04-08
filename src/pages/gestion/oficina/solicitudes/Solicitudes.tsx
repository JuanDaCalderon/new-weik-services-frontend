import {memo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {TOAST_DURATION} from '@/constants';
import {Toaster} from 'react-hot-toast';

const Solicitudes = memo(function Solicitudes() {
  return (
    <>
      <PageBreadcrumb title="Horario" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body className="position-relative">Solicitudes</Card.Body>
          </Card>
        </Col>
      </Row>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: TOAST_DURATION,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
});

export {Solicitudes};
