import {Card, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {FileUploader} from '@/components';
import projectImg1 from '@/assets/images/projects/project-1.jpg';

const Attachments = () => {
  return (
    <Card>
      <Card.Body>
        <h5 className="card-title mb-3">Attachments</h5>
        <FileUploader />

        {/* Files */}
        <Card className="my-1 shadow-none border">
          <div className="p-2">
            <Row className="align-items-center">
              <div className="col-auto">
                <div className="avatar-sm">
                  <span className="avatar-title rounded">.ZIP</span>
                </div>
              </div>
              <div className="col ps-0">
                <Link to="" className="text-muted fw-bold">
                  Hyper-admin-design.zip
                </Link>
                <p className="mb-0">2.3 MB</p>
              </div>
              <div className="col-auto">
                <Link to="" className="btn btn-link btn-lg text-muted">
                  <i className="ri-download-2-line"></i>
                </Link>
              </div>
            </Row>
          </div>
        </Card>

        <Card className="mb-1 shadow-none border">
          <div className="p-2">
            <Row className="align-items-center">
              <div className="col-auto">
                <img src={projectImg1} className="avatar-sm rounded" alt="" />
              </div>
              <div className="col ps-0">
                <Link to="" className="text-muted fw-bold">
                  Dashboard-design.jpg
                </Link>
                <p className="mb-0">3.5 MB</p>
              </div>
              <div className="col-auto">
                <Link to="" className="btn btn-link btn-lg text-muted">
                  <i className="ri-download-2-line"></i>
                </Link>
              </div>
            </Row>
          </div>
        </Card>

        <Card className="mb-0 shadow-none border">
          <div className="p-2">
            <Row className="align-items-center">
              <div className="col-auto">
                <div className="avatar-sm">
                  <span className="avatar-title bg-secondary rounded">.MP4</span>
                </div>
              </div>
              <div className="col ps-0">
                <Link to="" className="text-muted fw-bold">
                  Admin-bug-report.mp4
                </Link>
                <p className="mb-0">7.05 MB</p>
              </div>
              <div className="col-auto">
                <Link to="" className="btn btn-link btn-lg text-muted">
                  <i className="ri-download-2-line"></i>
                </Link>
              </div>
            </Row>
          </div>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default Attachments;
