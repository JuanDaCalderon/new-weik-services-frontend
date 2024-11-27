import {Row, Col, Container} from 'react-bootstrap';
import classNames from 'classnames';
import maintenanceImg from '@/assets/images/svg/maintenance.svg';
import {useAccountLayout} from '@/components/BGCircles';

type Query = {
  icon: string;
  title: string;
  desc: string;
};

const MaintenancePage = () => {
  const maintenanceQuery: Query[] = [
    {
      icon: 'ri-vip-diamond-line ',
      title: 'Why is the Site Down?',
      desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.'
    },
    {
      icon: 'ri-time-line',
      title: 'What is the Downtime?',
      desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical but the majority.'
    },
    {
      icon: 'ri-question-mark',
      title: 'Do you need Support?',
      desc: "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embar... no-reply@domain.com"
    }
  ];

  useAccountLayout();

  return (
    <>
      <div className="mt-5 mb-5">
        <Container>
          <Row className="justify-content-center">
            <Col xl={10}>
              <div className="text-center">
                <img src={maintenanceImg} height="140" alt="" />
                <h3 className="mt-4">Site is Under Maintenance</h3>
                <p className="text-muted">
                  We're making the system more awesome. We'll be back shortly.
                </p>

                <Row className="mt-5">
                  {maintenanceQuery.map((item, index) => {
                    return (
                      <Col key={index.toString()} md={4}>
                        <div className="text-center mt-3 ps-1 pe-1">
                          <i
                            className={classNames(
                              'bg-primary',
                              'maintenance-icon',
                              'text-white',
                              'mb-4',
                              item.icon
                            )}></i>
                          <h5 className="text-uppercase">{item.title}</h5>
                          <p className="text-muted">{item.desc}</p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <footer className="footer footer-alt">
        2018 - {new Date().getFullYear()} © Hyper - Coderthemes.com
      </footer>
    </>
  );
};

export default MaintenancePage;
