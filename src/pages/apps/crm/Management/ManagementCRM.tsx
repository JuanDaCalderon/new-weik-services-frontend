import {Col, Row} from 'react-bootstrap';
import MonthlyProgress from './MonthlyProgress';
import {progressDetails} from './data';
import {PageBreadcrumb} from '@/components';

const ManagementCRM = () => {
  return (
    <>
      <PageBreadcrumb title="Management" subName="CRM" />

      <Row>
        <Col xxl={12}>
          <MonthlyProgress progressDetails={progressDetails} />
        </Col>
      </Row>
    </>
  );
};

export {ManagementCRM};
