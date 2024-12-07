import {Row, Col} from 'react-bootstrap';
import Statistics from './Statistics';
import Tasks from './Tasks';
import Activity from './Activity';
import {PageBreadcrumb} from '@/components';

const ProjectDashboard = () => {
  return (
    <>
      <PageBreadcrumb title="Projects" subName="Dashboard" />

      <Statistics />

      <Row>
        <Col lg={6}>
          <Tasks />
        </Col>
        <Col xl={5}>
          <Activity />
        </Col>
      </Row>
    </>
  );
};

export {ProjectDashboard};
