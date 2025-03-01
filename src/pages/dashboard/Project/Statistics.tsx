import {Card, Row, Col} from 'react-bootstrap';

const Statistics = () => {
  return (
    <Row>
      <Col xs={12}>
        <Card className="widget-inline">
          <Card.Body className="p-0">
            <Row className="g-0">
              <Col sm={6} lg={3}>
                <Card className="shadow-none m-0">
                  <Card.Body className="text-center">
                    <i className="ri-briefcase-line text-muted font-24"></i>
                    <h3>
                      <span>29</span>
                    </h3>
                    <p className="text-muted font-15 mb-0">Total Projects</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} lg={3}>
                <Card className="shadow-none m-0 border-start">
                  <Card.Body className="text-center">
                    <i className="ri-list-check-2 text-muted font-24"></i>
                    <h3>
                      <span>715</span>
                    </h3>
                    <p className="text-muted font-15 mb-0">Total Tasks</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} lg={3}>
                <Card className="shadow-none m-0 border-start">
                  <Card.Body className="text-center">
                    <i className="ri-group-line text-muted font-24"></i>
                    <h3>
                      <span>31</span>
                    </h3>
                    <p className="text-muted font-15 mb-0">Members</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} lg={3}>
                <Card className="shadow-none m-0 border-start">
                  <Card.Body className="text-center">
                    <i className="ri-line-chart-line text-muted font-24"></i>
                    <h3>
                      <span>93%</span>
                      <i className="mdi mdi-arrow-up text-success"></i>
                    </h3>
                    <p className="text-muted font-15 mb-0">Productivity</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
