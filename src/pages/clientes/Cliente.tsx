import {PageBreadcrumb} from '@/components';
import {TableroNoticias} from '@/components/Noticias';
import {TOAST_DURATION} from '@/constants';
import {memo} from 'react';
import {Card, Col, Row} from 'react-bootstrap';
import {Toaster} from 'react-hot-toast';
import {useParams} from 'react-router-dom';

const Cliente = memo(function Cliente() {
  const {cliente} = useParams<{cliente: string}>();
  return (
    <>
      <PageBreadcrumb title={cliente ?? 'Cliente'} />

      <Row>
        <TableroNoticias />

        <Col>
          <Card>
            <Card.Body>
              <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">{cliente ?? 'Cliente'}</h4>
            </Card.Body>
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

export {Cliente};
