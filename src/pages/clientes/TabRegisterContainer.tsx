import {TABS_CLIENTES_ID_REGISTROS, TABS_CLIENTES_ID_REPORTES} from '@/constants';
import {TabContentItem} from '@/types';
import {memo, ReactNode, useState} from 'react';
import {Col, Nav, Row, Tab} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';

interface TabRegisterContainerProps {
  registerComponent: ReactNode;
  reportComponent: ReactNode;
}
const tabContents: TabContentItem[] = [
  {
    id: TABS_CLIENTES_ID_REGISTROS,
    title: TABS_CLIENTES_ID_REGISTROS,
    icon: 'mdi mdi-reorder-horizontal'
  },
  {
    id: TABS_CLIENTES_ID_REPORTES,
    title: TABS_CLIENTES_ID_REPORTES,
    icon: 'mdi mdi-chart-arc'
  }
];
const TabRegisterContainer = memo(function TabRegisterContainer({
  registerComponent,
  reportComponent
}: TabRegisterContainerProps) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(TABS_CLIENTES_ID_REGISTROS);

  const tabTitles = {
    [TABS_CLIENTES_ID_REGISTROS]: t('clientes.registros'),
    [TABS_CLIENTES_ID_REPORTES]: t('clientes.reportes')
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k ?? TABS_CLIENTES_ID_REGISTROS)}>
      <Nav variant="tabs" className="nav-bordered justify-content-center" as="ul">
        {tabContents.map((tab, index) => {
          return (
            <Nav.Item key={index.toString()} as="li">
              <Nav.Link as={Link} to="" eventKey={tab.title}>
                <i className={`${tab.icon} d-block d-md-none me-1`}></i>
                <span className="d-none d-md-block">{tabTitles[tab.id as keyof typeof tabTitles]}</span>
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
      <Tab.Content>
        {tabContents.map((tab, index) => {
          return (
            <Tab.Pane eventKey={tab.title} id={tab.id} key={index.toString()}>
              <Row>
                <Col xs={12}>
                  {tab.id === TABS_CLIENTES_ID_REGISTROS && <>{registerComponent}</>}
                  {tab.id === TABS_CLIENTES_ID_REPORTES && <>{reportComponent}</>}
                </Col>
              </Row>
            </Tab.Pane>
          );
        })}
      </Tab.Content>
    </Tab.Container>
  );
});

export default TabRegisterContainer;
