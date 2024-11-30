import {Link} from 'react-router-dom';
import {Row, Col, Card, Container, Image} from 'react-bootstrap';
import {BGCircles} from '@/components';
import Logo from '@/assets/images/logo.png';
import {DEFAULT_ROUTER_PATH, year} from '@/constants';

const ErrorPageNotFound = () => {
  return (
    <>
      <BGCircles />
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5} xxl={4}>
              <Card>
                <Card.Header className="py-3 text-center bg-primary">
                  <Link to={DEFAULT_ROUTER_PATH}>
                    <Image className="w-50" fluid src={Logo} alt="weikstudio" loading="lazy" />
                  </Link>
                </Card.Header>
                <Card.Body>
                  <div className="text-center">
                    <h1 className="text-error">
                      4<i className="mdi mdi-emoticon-sad"></i>4
                    </h1>
                    <h2 className="text-uppercase text-danger mt-2">Página no encontrada</h2>
                    <p className="text-dark text-opacity-75">
                      Parece que has tomado el camino equivocado. No te preocupes... nos pasa a los
                      mejores. Aquí tienes un pequeño consejo que puede ayudarte a retomar el rumbo.
                    </p>
                    <Link className="btn btn-info mt-1" to="/" replace>
                      <i className="mdi mdi-reply"></i> Regresar a weik services
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <footer className="footer footer-alt">{year} © Weik Motion Studio - weikstudio.com</footer>
    </>
  );
};

export default ErrorPageNotFound;
