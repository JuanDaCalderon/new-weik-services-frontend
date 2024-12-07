import {Card} from 'react-bootstrap';
import {CardTitle} from '..';

const Messages = () => {
  return (
    <Card>
      <Card.Body>
        <CardTitle
          containerClass="d-flex align-items-center justify-content-between mb-3"
          title="Messages"
          menuItems={[{label: 'Settings'}, {label: 'Action'}]}
        />
      </Card.Body>
    </Card>
  );
};

export default Messages;
