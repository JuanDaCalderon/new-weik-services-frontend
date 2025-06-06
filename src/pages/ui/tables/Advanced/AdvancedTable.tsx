import {PageBreadcrumb} from '@/components';
import ReactTable from '@/components/table/ReactTable';
import type {ColumnDef} from '@tanstack/react-table';
import {Card, CardBody, Col, Row} from 'react-bootstrap';
import {Employee} from '../types';
import {records as data, expandableRecords} from './data';

const columns: ColumnDef<Employee>[] = [
  {
    header: 'ID',
    accessorKey: 'id'
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Phone Number',
    accessorKey: 'phone'
  },
  {
    header: 'Age',
    accessorKey: 'age'
  },
  {
    header: 'Company',
    accessorKey: 'company'
  }
];

const AdvancedTable = () => {
  return (
    <>
      <PageBreadcrumb title="Advanced" subName="Tables" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4 className="header-title">Pagination &amp; Sort</h4>
              <p className="text-muted font-14 mb-4">A simple example of table with pagination and column sorting</p>

              <ReactTable<Employee> columns={columns} data={data} pageSize={5} showPagination />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4 className="header-title">Search</h4>
              <p className="text-muted font-14 mb-4">A Table allowing search</p>

              <ReactTable<Employee> columns={columns} data={data} pageSize={5} showPagination isSearchable={true} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4 className="header-title">Multiple Row Selection</h4>
              <p className="text-muted font-14 mb-4">This table allowing selection of multiple rows</p>

              <ReactTable<Employee> columns={columns} data={data} pageSize={5} showPagination isSelectable={true} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4 className="header-title">Expand Row</h4>
              <p className="text-muted font-14 mb-4">Expand row to see more additional details</p>

              <ReactTable<Employee>
                columns={columns}
                data={expandableRecords}
                pageSize={5}
                showPagination
                isExpandable={true}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export {AdvancedTable};
