import {memo, useEffect} from 'react';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {ToastWrapper} from '@/components/Toast';
import {TabContentItem} from '@/types';
import {TABS_REPORTES_ASISTENCIA, TABS_REPORTES_DESEMPEÑO, TABS_REPORTES_OBJETIVOS} from '@/constants';
import {Link} from 'react-router-dom';
import Balance from './balance';
import Objetivos from './objetivos';
import {useAppSelector} from '@/store';
import {selectEmployees} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';

const tabContents: TabContentItem[] = [
  {id: TABS_REPORTES_ASISTENCIA, title: TABS_REPORTES_ASISTENCIA},
  {id: TABS_REPORTES_OBJETIVOS, title: TABS_REPORTES_OBJETIVOS},
  {id: TABS_REPORTES_DESEMPEÑO, title: TABS_REPORTES_DESEMPEÑO}
];

const Reportes = memo(function Reportes() {
  const users = useAppSelector(selectEmployees);
  const {getEmployeesSync} = useGetEmployees();
  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Reportes" />
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey={TABS_REPORTES_ASISTENCIA}>
              <Col xs={12} md={2} xxl={1}>
                <Nav variant="pills" className="flex-column bg-light bg-gradient bg-opacity-50 rounded">
                  {tabContents.map((tab, index) => (
                    <Nav.Item className="w-100" key={index}>
                      <Nav.Link as={Link} to="#" eventKey={tab.id}>
                        {tab.title}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Col>
              <Col xs={12} md={10} xxl={11} className="mt-2 mt-md-0">
                <Tab.Content>
                  {tabContents.map((tab, index) => (
                    <Tab.Pane eventKey={tab.id} key={index}>
                      <Row>
                        <Col sm={12}>
                          {tab.id === TABS_REPORTES_ASISTENCIA && <Balance users={users} />}
                          {tab.id === TABS_REPORTES_OBJETIVOS && <Objetivos users={users} />}
                          {tab.id === TABS_REPORTES_DESEMPEÑO && <></>}
                        </Col>
                      </Row>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Col>
            </Tab.Container>
          </Row>
        </Card.Body>
      </Card>
    </ToastWrapper>
  );
});

export {Reportes};
