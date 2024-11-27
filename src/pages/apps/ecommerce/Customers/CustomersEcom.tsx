import { PageBreadcrumb } from '@/components';
import ReactTable from '@/components/table/ReactTable';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { customers } from '../data';
import { Customer } from '../types';
import { columns, sizePerPageList } from './ColumnsSet';

const CustomersEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Customers" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row>
								<Col sm={5}>
									<Button className="btn btn-danger mb-2">
										<i className="mdi mdi-plus-circle me-2"></i> Add Customers
									</Button>
								</Col>

								<Col sm={7}>
									<div className="text-sm-end">
										<Button className="btn btn-success mb-2 me-1">
											<i className="mdi mdi-cog"></i>
										</Button>

										<Button className="btn btn-light mb-2 me-1">Import</Button>

										<Button className="btn btn-light mb-2">Export</Button>
									</div>
								</Col>
							</Row>

							<ReactTable<Customer>
								columns={columns}
								data={customers}
								pageSize={10}
								rowsPerPageList={sizePerPageList}
								tableClass="table-striped"
								showPagination
								isSearchable
								isSelectable
								searchBoxClass="mt-2 mb-3"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { CustomersEcom };
