import { PageBreadcrumb } from '@/components';
import ReactTable from '@/components/table/ReactTable';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useOrders } from '../hooks';
import { Order } from '../types';
import { columns, sizePerPageList } from './ColumnsSet';

const OrdersEcom = () => {
	const { orderList, changeOrderStatusGroup } = useOrders();

	return (
		<>
			<PageBreadcrumb title="Orders" subName="E-Commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row className="mb-2">
								<Col xl={8}>
									<form className="row gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
										<div className="col-auto">
											<div className="d-flex align-items-center w-auto">
												<label htmlFor="status-select" className="me-2">
													Status
												</label>
												<select
													className="form-select"
													id="status-select"
													onChange={(e) =>
														changeOrderStatusGroup(e.target.value)
													}
												>
													<option value="All">All</option>
													<option value="Paid">Paid</option>
													<option value="Authorization">
														Awaiting Authorization
													</option>
													<option value="Failed">Payment failed</option>
													<option value="Unpaid">Unpaid</option>
												</select>
											</div>
										</div>
									</form>
								</Col>

								<Col xl={4}>
									<div className="text-lg-end mt-xl-0 mt-2">
										<Button variant="danger" className="mb-2 me-2">
											<i className="mdi mdi-basket me-1"></i> Add New Order
										</Button>
										<Button variant="light" className="mb-2">
											Export
										</Button>
									</div>
								</Col>
							</Row>

							<ReactTable<Order>
								columns={columns}
								data={orderList}
								pageSize={10}
								rowsPerPageList={sizePerPageList}
								showPagination
								isSearchable={true}
								theadClass="table-light"
								isSelectable
								searchBoxClass="mb-2"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { OrdersEcom };
