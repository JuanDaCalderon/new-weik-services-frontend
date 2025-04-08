import {memo} from 'react';
import {Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/table/ReactTable';
import {columns} from './Columnas';

const Ppts = memo(function Ppts() {
  return (
    <>
      <Row>
        <Col>
          <ReactTable<any> columns={columns} data={[]} pageSize={10} tableClass="table-striped" showPagination />
        </Col>
      </Row>
    </>
  );
});

export {Ppts};
