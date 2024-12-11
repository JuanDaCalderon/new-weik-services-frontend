import {Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useTaskList} from '../hooks';
import TaskSection from './Section';

const ListTask = () => {
  const {todayTask, upcomingTask, otherTask, selectTask} = useTaskList();
  return (
    <Row>
      <Col xxl={12}>
        <div className="page-title-box">
          <h4 className="page-title">
            Tasks
            <Link to="" className="btn btn-success btn-sm ms-3">
              Add New
            </Link>
          </h4>
        </div>
        <div className="mt-2">
          <TaskSection title="Today" tasks={todayTask} selectTask={selectTask} />
        </div>
        <div className="mt-4">
          <TaskSection title="Upcoming" tasks={upcomingTask} selectTask={selectTask} />
        </div>
        <div className="mt-4 mb-4">
          <TaskSection title="Other" tasks={otherTask} selectTask={selectTask} />
        </div>
      </Col>
    </Row>
  );
};

export {ListTask};
