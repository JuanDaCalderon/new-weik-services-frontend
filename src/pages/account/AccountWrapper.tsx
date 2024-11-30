import {ReactNode, memo} from 'react';
import {Card, Col, Container, Row, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {BGCircles} from '@/components';
import Logo from '@/assets/images/logo.png';
import {Toaster} from 'react-hot-toast';
import {DEFAULT_ROUTER_PATH, year} from '@/constants';

type AccountWrapperProps = {
  children?: ReactNode;
  bottomLinks?: ReactNode;
};

function AccountWrapper({bottomLinks, children}: AccountWrapperProps) {
  return (
    <>
      <BGCircles />
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5} xxl={4}>
              <Card>
                <Card.Header className="pt-3 pb-3 text-center bg-primary">
                  <Link to={DEFAULT_ROUTER_PATH}>
                    <Image className="w-50" fluid src={Logo} alt="weikstudio" loading="lazy" />
                  </Link>
                </Card.Header>
                <Card.Body>{children}</Card.Body>
              </Card>
              {bottomLinks}
            </Col>
          </Row>
        </Container>
      </div>
      <footer className="footer footer-alt">{year} © Weik Motion Studio - weikstudio.com</footer>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 6000,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
}

export default memo(AccountWrapper);
