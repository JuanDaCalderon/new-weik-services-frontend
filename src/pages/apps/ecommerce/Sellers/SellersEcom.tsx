import {PageBreadcrumb} from '@/components';
import ReactTable from '@/components/table/ReactTable';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {sellers} from '../data';
import {Seller} from '../types';
import {columns} from './ColumnsSet';

const SellersEcom = () => {
  return (
    <>
      <PageBreadcrumb title="Sellers" subName="E-commerce" />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row className="mb-2">
                <Col sm={5}>
                  <Button variant="danger" className="mb-2">
                    <i className="mdi mdi-plus-circle me-2"></i> Add Sellers
                  </Button>
                </Col>

                <Col sm={7}>
                  <div className="text-sm-end">
                    <Button variant="success" className="mb-2 me-1">
                      <i className="mdi mdi-cog"></i>
                    </Button>

                    <Button variant="light" className="mb-2 me-1">
                      Import
                    </Button>

                    <Button variant="light" className="mb-2 me-1">
                      Export
                    </Button>
                  </div>
                </Col>
              </Row>

              <ReactTable<Seller>
                columns={columns}
                data={sellers}
                pageSize={10}
                showPagination
                isSelectable={true}
                tableClass="table-striped"
                theadClass="table-light"
                searchBoxClass="mt-2 mb-3"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export {SellersEcom};
