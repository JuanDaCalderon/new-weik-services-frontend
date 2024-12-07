import {Row, Col} from 'react-bootstrap';
import {TodoList, PageBreadcrumb} from '@/components';
import Performers from './Performers';
import Leads from './Leads';
import {topPerformanceData, recentLeads} from './data';

const CRMDashboard = () => {
  return (
    <>
      <PageBreadcrumb title="CRM" subName="Dashboard" />

      <Row>
        <Col xl={4} lg={12}>
          <Performers topPerformanceData={topPerformanceData} />
        </Col>
        <Col xl={4} lg={6}>
          <Leads recentLeads={recentLeads} />
        </Col>
        <Col xl={4} lg={6}>
          <TodoList height="220px" />
        </Col>
      </Row>
    </>
  );
};

export {CRMDashboard};
