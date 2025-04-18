import {Card} from 'react-bootstrap';

const Statistics = () => {
  /**
   * Live count generator
   */
  const liveCountGenerator = () => {
    setInterval(function () {
      const activeUsersCount = Math.floor(Math.random() * 600 + 150);

      const activeUserElement = document.getElementById('active-users-count');
      if (activeUserElement) {
        activeUserElement.innerHTML = activeUsersCount.toString();
      }

      const activeViewsElement = document.getElementById('active-views-count');
      if (activeViewsElement) {
        activeViewsElement.innerHTML = Math.floor(Math.random() * activeUsersCount + 200).toString();
      }
    }, 2000);
  };
  liveCountGenerator();

  return (
    <>
      <Card className="tilebox-one">
        <Card.Body>
          <i className="uil uil-users-alt float-end"></i>
          <h6 className="text-uppercase mt-0">Active Users</h6>
          <h2 className="my-2" id="active-users-count">
            121
          </h2>
          <p className="mb-0 text-muted">
            <span className="text-success me-2">
              <span className="mdi mdi-arrow-up-bold"></span> 5.27%
            </span>
            <span className="text-nowrap">Since last month</span>
          </p>
        </Card.Body>
      </Card>

      <Card className="tilebox-one">
        <Card.Body>
          <i className="uil uil-window-restore float-end"></i>
          <h6 className="text-uppercase mt-0">Views per minute</h6>
          <h2 className="my-2" id="active-views-count">
            560
          </h2>
          <p className="mb-0 text-muted">
            <span className="text-danger me-2">
              <span className="mdi mdi-arrow-down-bold"></span> 1.08%
            </span>
            <span className="text-nowrap">Since previous week</span>
          </p>
        </Card.Body>
      </Card>
    </>
  );
};

export default Statistics;
