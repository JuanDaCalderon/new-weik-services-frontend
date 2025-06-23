import {memo, useEffect, useMemo} from 'react';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import {ToastWrapper} from '@/components/Toast';
import {TabContentItem} from '@/types';
import {TABS_REPORTES_ID_ASISTENCIA, TABS_REPORTES_ID_OBJETIVOS} from '@/constants';
import {Link} from 'react-router-dom';
import Balance from './balance';
import Objetivos from './objetivos';
import {useAppSelector} from '@/store';
import {selectEmployees, selectObjetivos} from '@/store/selectores';
import {useGetEmployees, useGetObjetivos} from '@/endpoints';
import {useTranslation} from 'react-i18next';
import useGetVacaciones from '@/endpoints/db/vacaciones/useGetVacaciones';
import {selectVacaciones} from '@/store/selectores/vacaciones';
import useGetHorarios from '@/endpoints/db/horarios/useGetHorarios';
import {selectHorarios} from '@/store/selectores/horarios';

const Reportes = memo(function Reportes() {
  const {t} = useTranslation();
  const users = useAppSelector(selectEmployees);
  const vacaciones = useAppSelector(selectVacaciones);
  const horarios = useAppSelector(selectHorarios);
  const objetivos = useAppSelector(selectObjetivos);
  const {getEmployeesSync} = useGetEmployees();
  const {getVacacionesSync} = useGetVacaciones();
  const {getHorariosSync} = useGetHorarios();
  const {getObjetivosSync} = useGetObjetivos();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  useEffect(() => {
    if (horarios.length <= 0) getHorariosSync();
  }, [getHorariosSync, horarios.length]);

  useEffect(() => {
    if (vacaciones.length <= 0) getVacacionesSync();
  }, [getVacacionesSync, vacaciones.length]);

  useEffect(() => {
    if (objetivos.length <= 0) getObjetivosSync();
  }, [getObjetivosSync, objetivos.length]);

  const tabContents: TabContentItem[] = useMemo(() => {
    return [
      {id: TABS_REPORTES_ID_ASISTENCIA, title: t('gestion.oficina.reportes.asistencia')},
      {id: TABS_REPORTES_ID_OBJETIVOS, title: t('gestion.oficina.reportes.objetivos')}
    ];
  }, [t]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title="Reportes" />
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey={TABS_REPORTES_ID_ASISTENCIA}>
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
                          {tab.id === TABS_REPORTES_ID_ASISTENCIA && <Balance users={users} />}
                          {tab.id === TABS_REPORTES_ID_OBJETIVOS && <Objetivos users={users} />}
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
