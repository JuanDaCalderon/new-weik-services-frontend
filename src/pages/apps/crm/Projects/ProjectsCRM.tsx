import {Row, Col} from 'react-bootstrap';
import ProjectSummary from './ProjectSummary';
import DailyTasks from './DailyTasks';
import TeamMembers from './TeamMembers';
import {members, tasksData} from './data';
import {PageBreadcrumb} from '@/components';

const ProjectsCRM = () => {
  return (
    <>
      <PageBreadcrumb title="Projects" subName="CRM" />

      <Row>
        <Col xxl={3}>
          <ProjectSummary />
        </Col>
        <Col xxl={3}>
          <DailyTasks taskData={tasksData} />
        </Col>
        <Col xxl={3}>
          <TeamMembers members={members} />
        </Col>
      </Row>
    </>
  );
};

export {ProjectsCRM};
