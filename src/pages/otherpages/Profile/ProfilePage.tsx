import {Row, Col} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import UserBox from './UserBox';
import SellerBox from './SellerBox';
import Statistics from './Statistics';

const ProfilePage = () => {
  return (
    <>
      <PageBreadcrumb title="Profile" subName="Pages" />

      <Row>
        <Col sm={12}>
          <UserBox />
        </Col>
      </Row>

      <Row>
        <Col xl={4}>
          <SellerBox />
        </Col>

        <Col xl={8}>
          <Statistics />
        </Col>
      </Row>
    </>
  );
};

export {ProfilePage};
