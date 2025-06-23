import {Row, Col, Card, Container, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Logo from '@/assets/images/logo.png';
import {BGCircles} from '@/components';
import {LOGIN_ROUTER_PATH, year} from '@/constants';
import config from '@/config';

const InternalError = () => {
  return (
    <>
      <BGCircles />
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5} xxl={4}>
              <Card>
                <Card.Header className="py-3 text-center bg-primary">
                  <Link to={LOGIN_ROUTER_PATH}>
                    <Image className="w-50" fluid src={Logo} alt="devikgo" loading="lazy" />
                  </Link>
                </Card.Header>
                <Card.Body>
                  <div className="text-center">
                    <h1 className="text-uppercase text-danger mt-1 h3">Error interno</h1>
                    <p className="text-dark text-opacity-75">¿Por qué no intentas actualizar tu página?</p>
                    <Link className="btn btn-info mt-1" to="/" replace>
                      <i className="mdi mdi-reply"></i> Regresar a Devik Go
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <footer className="footer footer-alt">
        {year} © DevikGo - {config.APP_VERSION}
      </footer>
    </>
  );
};

export default InternalError;
