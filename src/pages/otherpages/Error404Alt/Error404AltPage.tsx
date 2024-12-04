import {Link} from 'react-router-dom';
import {Row, Col, Container} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import notFoundImg from '@/assets/images/svg/file-searching.svg';

const Error404AltPage = () => {
  return (
    <>
      <PageBreadcrumb title="Página no encontrada" />
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={4}>
              <div className="text-center">
                <img src={notFoundImg} height="90" alt="notFoundImg" loading="lazy" />
                <h1 className="text-error mt-4">404</h1>
                <h4 className="text-uppercase text-danger mt-3">Página no encontrada</h4>
                <p className="text-muted mt-3">
                  Parece que has tomado el camino equivocado. No te preocupes... nos pasa a los
                  mejores. Aquí tienes un pequeño consejo que puede ayudarte a retomar el rumbo.
                </p>
                <Link className="btn btn-info mt-3" to="/" replace>
                  <i className="mdi mdi-reply"></i> Regresar a weik services
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export {Error404AltPage};
