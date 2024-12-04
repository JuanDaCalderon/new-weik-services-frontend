import {Row, Col} from 'react-bootstrap';
import ChatUsers from './ChatUsers';

const ChatApp = () => {
  return (
    <Row>
      <Col xxl={3}>
        <ChatUsers />
      </Col>
    </Row>
  );
};

export {ChatApp};
