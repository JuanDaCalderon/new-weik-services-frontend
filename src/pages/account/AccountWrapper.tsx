import {ReactNode, memo} from 'react';
import {Card, Col, Container, Row, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {BGCircles, LanguageDropdown} from '@/components';
import Logo from '@/assets/images/logo.png';
import {LOGIN_ROUTER_PATH, year} from '@/constants';
import config from '@/config';

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
                  <Link to={LOGIN_ROUTER_PATH}>
                    <Image className="w-50" fluid src={Logo} alt="devikgo" loading="lazy" />
                  </Link>
                </Card.Header>
                <Card.Body>{children}</Card.Body>
              </Card>
              {bottomLinks}
            </Col>
          </Row>
        </Container>
        <div className="position-absolute top-0 end-0 mt-2 me-2">
          <LanguageDropdown />
        </div>
      </div>
      <footer className="footer footer-alt">
        {year} © DevikGo - {config.APP_VERSION}
      </footer>
    </>
  );
}

export default memo(AccountWrapper);
