import {memo, useCallback, useEffect, useState, ChangeEventHandler} from 'react';
import {Card, Col, Form, Row} from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import {useGetEmployees} from '@/endpoints';
import {useAppSelector} from '@/store';
import {SkeletonLoader} from '@/components/SkeletonLoader';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {ESTADOS} from '@/constants';
import {Employee} from '@/types';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import {getCargoUser, getUserNameUser} from '@/utils';

const TeamMembers = memo(function TeamMembers() {
  const {getEmployeesListener} = useGetEmployees();
  const employeesFromStore = useAppSelector(selectEmployees);
  const isLoadingEmployees = useAppSelector(selectisLoadingEmployees);
  const {id} = useAppSelector(selectUser);
  const [optionFilter, setOptionFilter] = useState<{option: ESTADOS}>({option: ESTADOS.online});
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const unsubscribe = getEmployeesListener();
    return () => {
      unsubscribe();
    };
  }, [getEmployeesListener]);

  useEffect(() => {
    if (employeesFromStore.length > 0) {
      setEmployees([...employeesFromStore.filter((e) => e.estado === optionFilter.option && e.id !== id)]);
    } else setEmployees([]);
  }, [employeesFromStore, id, optionFilter.option]);

  const handleSelectChanged: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    setOptionFilter({option: e.target.value as ESTADOS});
  }, []);

  const redirectToUser = useCallback(() => {
    window.open('https://mail.google.com/chat/u/0/#chat/home', '_blank');
  }, []);

  return (
    <Card className="TeamMembers mx-2 bg-body">
      <Card.Body className="p-2 shadow">
        {isLoadingEmployees ? (
          <SkeletonLoader customClass="p-0 m-0" height="400px"></SkeletonLoader>
        ) : (
          <>
            <Row>
              <Col>
                <h4 className="header-title p-0 text-dark">Equipo</h4>
                <Form.Select
                  className="form-select-sm w-100"
                  name="option"
                  size="sm"
                  value={optionFilter.option}
                  onChange={handleSelectChanged}>
                  <option value={ESTADOS.online}>{ESTADOS.online}</option>
                  <option value={ESTADOS.offline}>{ESTADOS.offline}</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="w-100">
                <SimpleBar style={{maxHeight: '400px', width: '100%'}}>
                  {employees.length > 0 ? (
                    employees.map((employee, index) => {
                      return (
                        <div className="team-card pt-1" key={index.toString()} style={{flexShrink: 0, height: '52px'}}>
                          <button
                            key={index}
                            className="border-0 team-button p-1 m-0 w-100 h-100 d-flex align-content-center align-items-center justify-content-between rounded-1 bg-light"
                            onClick={redirectToUser}>
                            <div className="d-flex">
                              <div className="member-image d-flex align-content-center align-items-center">
                                <img
                                  className="img rounded-circle object-fit-cover"
                                  style={{objectFit: 'cover', aspectRatio: '1/1'}}
                                  src={employee.userImage ? employee.userImage : fallBackLogo}
                                  width="35"
                                  height="35"
                                  alt="equipo"
                                  loading="lazy"
                                />
                              </div>
                              <div className="member-text d-flex flex-column align-content-start align-items-start justify-content-center ms-2">
                                <h5 className="m-0 p-0 text-capitalize font-14 text-dark">
                                  {getUserNameUser(employee)}
                                </h5>
                                <span className="font-12 lh-sm">{getCargoUser(employee).toLowerCase()}</span>
                              </div>
                            </div>
                            <span className="font-12 text-muted ms-auto">{employee.estado}</span>
                            <span
                              className={`p-1 bg-${employee.estado === ESTADOS.online ? 'success' : 'danger'} rounded-circle mx-1`}>
                              <span className="visually-hidden">{employee.estado}</span>
                            </span>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="team-card pt-1" style={{flexShrink: 0, height: '52px'}}>
                      <button className="border-0 team-button p-1 m-0 w-100 h-100 d-flex align-content-center align-items-center justify-content-between rounded-1 bg-light">
                        <h5 className="m-0 p-0 font-14 text-dark">No hay usuarios {optionFilter.option}</h5>
                      </button>
                    </div>
                  )}
                </SimpleBar>
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
});

export {TeamMembers};
