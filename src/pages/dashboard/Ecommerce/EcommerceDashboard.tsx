import {useEffect, useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {CustomDatePicker} from '@/components';
import Statistics from './Statistics';
import Activity from './Activity';
import Products from './Products';
import {useGetClients, useRolesYPermisos} from '@/endpoints';
import {useAppSelector} from '@/store';
import {permisosSelector, rolesSelector, selectClientes} from '@/store/selectores';

const EcommerceDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {getRolesSync, getPermisosSync} = useRolesYPermisos();
  const {getClientesSync} = useGetClients();
  const clientes = useAppSelector(selectClientes);
  const roles = useAppSelector(rolesSelector);
  const permisos = useAppSelector(permisosSelector);

  useEffect(() => {
    if (clientes.length <= 0) getClientesSync();
  }, [clientes.length, getClientesSync]);

  useEffect(() => {
    if (roles.length <= 0) getRolesSync();
  }, [roles.length, getRolesSync]);

  useEffect(() => {
    if (permisos.length <= 0) getPermisosSync();
  }, [permisos.length, getPermisosSync]);

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
        <Col xl={5}>
          <Products />
        </Col>
        <Col xl={3} lg={{span: 6, order: 1}}>
          <Activity />
        </Col>
      </Row>
    </>
  );
};

export {EcommerceDashboard};
