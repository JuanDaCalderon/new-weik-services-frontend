import {Row, Col} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import UserPortadaBox from './UserPortadaBox';
import InfoUserBox from './InfoUserBox';
import HubLaboral from './HubLaboral';
import UserRolesYPermisos from './RolesYPermisos';
import PasswordBox from './PasswordBox';
import {ToastWrapper} from '@/components/Toast';

const ProfilePage = () => {
  return (
    <ToastWrapper>
      <PageBreadcrumb title="Mi Cuenta" />

      <Row>
        <Col xs={12} xl={4} xxl={3}>
          <UserPortadaBox />
          <InfoUserBox />
          <PasswordBox />
          <UserRolesYPermisos />
        </Col>

        <Col xs={12} xl={8} xxl={9}>
          <HubLaboral />
        </Col>
      </Row>
    </ToastWrapper>
  );
};

export {ProfilePage};
