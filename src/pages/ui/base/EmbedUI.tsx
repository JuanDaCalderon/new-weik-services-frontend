import {Row, Col, Card} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';

const EmbedUI = () => {
  return (
    <>
      <PageBreadcrumb title="Embed Video" subName="Base UI" />

      <Row>
        <Col xl={6}>
          <Card>
            <Card.Body>
              <h4 className="header-title">Responsive embed video 21:9</h4>
              <p className="text-muted font-14">
                Use class <code>.ratio-21x9</code>
              </p>

              {/* 21:9 aspect ratio */}
              <div className="ratio ratio-21x9">
                <iframe
                  src="https://www.youtube.com/embed/PrUxWZiQfy4?autohide=0&showinfo=0&controls=0"
                  title="iframe"></iframe>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h4 className="header-title">Responsive embed video 1:1</h4>
              <p className="text-muted font-14">
                Use class <code>.ratio-1x1</code>
              </p>

              {/* 1:1 aspect ratio */}
              <div className="ratio ratio-1x1">
                <iframe src="https://www.youtube.com/embed/PrUxWZiQfy4?ecver=1" title="iframe"></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6}>
          <Card>
            <Card.Body>
              <h4 className="header-title">Responsive embed video 16:9</h4>
              <p className="text-muted font-14">
                Use class <code>.ratio-16x9</code>
              </p>

              {/* 16:9 aspect ratio */}
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.youtube.com/embed/PrUxWZiQfy4?autohide=0&showinfo=0&controls=0"
                  title="iframe"></iframe>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h4 className="header-title">Responsive embed video 4:3</h4>
              <p className="text-muted font-14">
                Use class <code>.ratio-4x3</code>
              </p>

              {/* 4:3 aspect ratio */}
              <div className="ratio ratio-4x3">
                <iframe src="https://www.youtube.com/embed/PrUxWZiQfy4?ecver=1" title="iframe"></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EmbedUI;
