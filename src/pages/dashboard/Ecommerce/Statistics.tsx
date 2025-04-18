import {Row, Col} from 'react-bootstrap';
import {StatisticsWidget} from '@/components';

const Statistics = () => {
  return (
    <>
      <Row>
        <Col sm={6}>
          <StatisticsWidget
            icon="mdi mdi-account-multiple"
            description="Number of Customers"
            title="Customers"
            stats="36,254"
            trend={{
              textClass: 'text-success',
              icon: 'mdi mdi-arrow-up-bold',
              value: '5.27%',
              time: 'Since last month'
            }}></StatisticsWidget>
        </Col>

        <Col sm={6}>
          <StatisticsWidget
            icon="mdi mdi-cart-plus"
            description="Number of Orders"
            title="Orders"
            stats="5,543"
            trend={{
              textClass: 'text-danger',
              icon: 'mdi mdi-arrow-down-bold',
              value: '1.08%',
              time: 'Since last month'
            }}></StatisticsWidget>
        </Col>
      </Row>
    </>
  );
};

export default Statistics;
