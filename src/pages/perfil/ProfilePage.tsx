import {Row, Col} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import UserPortadaBox from './UserPortadaBox';
import InfoUserBox from './InfoUserBox';
import HubLaboral from './HubLaboral';
import UserRolesYPermisos from './RolesYPermisos';
import {Toaster} from 'react-hot-toast';
import PasswordBox from './PasswordBox';
import {TOAST_DURATION} from '@/constants';

const ProfilePage = () => {
  return (
    <>
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

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: TOAST_DURATION,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
};

export {ProfilePage};
