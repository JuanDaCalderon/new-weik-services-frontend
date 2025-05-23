import {memo} from 'react';
import {Col, Row} from 'react-bootstrap';
import ReactTable from '@/components/tablev02/ReactTable';
import {columns} from './Columnas';

const Registros = memo(function Registros() {
  return (
    <Row>
      <Col>
        <ReactTable<any>
          columns={columns}
          data={[]}
          pageSize={10}
          tableClass="table-striped"
          showPagination
          isExpandable
          isSearchable
          isSelectable
        />
      </Col>
    </Row>
  );
});

export {Registros};
