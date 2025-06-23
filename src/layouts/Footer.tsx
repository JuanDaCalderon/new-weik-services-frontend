import config from '@/config';
import {Col, Row} from 'react-bootstrap';
import {year} from '@/constants';
import {memo} from 'react';

export default memo(function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <Row>
          <Col xs={12}>
            {year} © DevikGo - {config.APP_VERSION}
          </Col>
        </Row>
      </div>
    </footer>
  );
});
