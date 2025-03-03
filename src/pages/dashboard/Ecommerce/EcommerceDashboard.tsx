import {useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {CustomDatePicker} from '@/components';
import Statistics from './Statistics';
import Activity from './Activity';
import {Toaster} from 'react-hot-toast';
import {TOAST_DURATION} from '@/constants';

const EcommerceDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <>
      <Row>
        <Col xs={12}>
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
                <Link to="" className="btn btn-primary ms-2">
                  <i className="mdi mdi-autorenew"></i>
                </Link>
                <Link to="" className="btn btn-primary ms-1">
                  <i className="mdi mdi-filter-variant"></i>
                </Link>
              </form>
            </div>
            <h4 className="page-title">Dashboard</h4>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xl={4} lg={6}>
          <Statistics />
        </Col>
        <Col xl={3} lg={{span: 6, order: 1}}>
          <Activity />
        </Col>
      </Row>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: TOAST_DURATION,
          style: {
            background: '#4f565c',
            color: '#fff'
          }
        }}
      />
    </>
  );
};

export {EcommerceDashboard};
