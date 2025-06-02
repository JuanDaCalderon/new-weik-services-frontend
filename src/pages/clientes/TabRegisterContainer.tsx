import {TABS_CLIENTES_REGISTROS, TABS_CLIENTES_REPORTES} from '@/constants';
import {TabContentItem} from '@/types';
import {memo, ReactNode} from 'react';
import {Col, Nav, Row, Tab} from 'react-bootstrap';
import {Link} from 'react-router-dom';

interface TabRegisterContainerProps {
  registerComponent: ReactNode;
  reportComponent: ReactNode;
}

const tabContents: TabContentItem[] = [
  {
    id: TABS_CLIENTES_REGISTROS,
    title: TABS_CLIENTES_REGISTROS,
    icon: 'mdi mdi-reorder-horizontal'
  },
  {
    id: TABS_CLIENTES_REPORTES,
    title: TABS_CLIENTES_REPORTES,
    icon: 'mdi mdi-chart-arc'
  }
];

const TabRegisterContainer = memo(function TabRegisterContainer({
  registerComponent,
  reportComponent
}: TabRegisterContainerProps) {
  return (
    <Tab.Container defaultActiveKey={TABS_CLIENTES_REGISTROS}>
      <Nav variant="tabs" className="nav-bordered justify-content-center" as="ul">
        {tabContents.map((tab, index) => {
          return (
            <Nav.Item key={index.toString()} as="li">
              <Nav.Link as={Link} to="" eventKey={tab.title}>
                <i className={`${tab.icon} d-block d-md-none me-1`}></i>
                <span className="d-none d-md-block">{tab.title}</span>
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
                  {tab.id === TABS_CLIENTES_REGISTROS && <>{registerComponent}</>}
                  {tab.id === TABS_CLIENTES_REPORTES && <>{reportComponent}</>}
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
