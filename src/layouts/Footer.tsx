import config from '@/config';
import {Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {year} from '@/constants';
import {memo} from 'react';

export default memo(function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <Row>
          <Col md={6}>
            {year} © DevikGo - devikgo.com - {config.APP_VERSION}
          </Col>
          <Col md={6}>
            <div className="text-md-end footer-links d-none d-md-block">
              <Link to="https://www.weikstudio.com/en/nosotros/" target="_blank">
                Nosotros
              </Link>
              &nbsp;
              <Link to="https://www.weikstudio.com/contacto/" target="_blank">
                Contacto
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
});
