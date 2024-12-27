import {thisRol} from '@/types';
import {Row as RowTable} from '@tanstack/react-table';
import {memo} from 'react';
import {Button, Col, Row} from 'react-bootstrap';

const EdicionRol = memo(function EdicionRol({row}: {row: RowTable<thisRol>}) {
  return (
    <Row className="m-0 py-2 column-gap-1 bg-light-subtle">
      <span className="mb-1">
        <strong>Edición del rol {row.original.rolName}</strong>
      </span>
      <Col xs="auto" md={12} className="ms-auto mt-2">
        <Button className="shadow-sm" variant="info" onClick={() => {}} disabled={false}>
          Guardar cambios
        </Button>
      </Col>
    </Row>
  );
});

export {EdicionRol};
