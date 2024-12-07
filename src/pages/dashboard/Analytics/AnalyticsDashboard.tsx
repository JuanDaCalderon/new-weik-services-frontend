import {useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import Statistics from './Statistics';
import Channels from './Channels';
import {CustomDatePicker} from '@/components';

const AnalyticsDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <>
      <Row>
        <Col>
          <div className="page-title-box">
            <div className="page-title-right">
              <form className="d-flex">
                <div className="input-group">
                  <CustomDatePicker
                    value={selectedDate}
                    inputClass="form-control-light"
                    onChange={(date) => {
                      setSelectedDate(date);
                    }}
                  />
                </div>
                <button className="btn btn-primary ms-2">
                  <i className="mdi mdi-autorenew"></i>
                </button>
              </form>
            </div>
            <h4 className="page-title">Analytics</h4>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xl={3} lg={4}>
          <Statistics />
        </Col>
        <Col xl={4} lg={6}>
          <Channels />
        </Col>
      </Row>
    </>
  );
};

export {AnalyticsDashboard};
