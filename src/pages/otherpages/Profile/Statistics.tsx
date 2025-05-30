import {Card, Row, Col} from 'react-bootstrap';

const Statistics = () => {
  return (
    <Row>
      <Col sm={4}>
        <Card className="tilebox-one">
          <Card.Body>
            <i className="ri-shopping-basket-2-line float-end text-muted"></i>
            <h6 className="text-muted text-uppercase mt-0">Orders</h6>
            <h2 className="m-b-20">1,587</h2>
            <span className="badge bg-primary"> +11% </span>
            <span className="text-muted">From previous period</span>
          </Card.Body>
        </Card>
      </Col>

      <Col sm={4}>
        <Card className="tilebox-one">
          <Card.Body>
            <i className="ri-archive-line float-end text-muted"></i>
            <h6 className="text-muted text-uppercase mt-0">Revenue</h6>
            <h2 className="m-b-20">
              $<span>46,782</span>
            </h2>
            <span className="badge bg-danger"> -29% </span>
            <span className="text-muted">From previous period</span>
          </Card.Body>
        </Card>
      </Col>

      <Col sm={4}>
        <Card className="tilebox-one">
          <Card.Body>
            <i className="ri-vip-diamond-line float-end text-muted"></i>
            <h6 className="text-muted text-uppercase mt-0">Product Sold</h6>
            <h2 className="m-b-20">1,890</h2>
            <span className="badge bg-primary"> +89% </span>
            <span className="text-muted">Last year</span>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
