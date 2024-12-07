import {Row, Col} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import UserPortadaBox from './UserPortadaBox';
import InfoUserBox from './InfoUserBox';
import HubLaboral from './HubLaboral';
import UserRolesYPermisos from './RolesYPermisos';
import {Toaster} from 'react-hot-toast';

const ProfilePage = () => {
  return (
    <>
      <PageBreadcrumb title="Mi Cuenta" />

      <Row>
        <Col sm={12}>
          <UserPortadaBox />
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={4} xxl={3}>
          <InfoUserBox />
          <UserRolesYPermisos />
        </Col>

        <Col xs={12} xl={8} xxl={9}>
          <HubLaboral />
        </Col>
      </Row>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
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
