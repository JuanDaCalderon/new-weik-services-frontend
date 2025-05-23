import {PageBreadcrumb} from '@/components';
import {TableroNoticias} from '@/components/Noticias';
import {ToastWrapper} from '@/components/Toast';
import {TABS_CLIENTES_MOTIONS, TABS_CLIENTES_PPTS} from '@/constants';
import {TabContentItem} from '@/types';
import {memo} from 'react';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import {Ppts} from './ppts/Ppts';
import {Motions} from './motions/Motions';

const tabContents: TabContentItem[] = [
  {
    id: TABS_CLIENTES_PPTS,
    title: TABS_CLIENTES_PPTS,
    icon: 'mdi mdi-file-presentation-box'
  },
  {
    id: TABS_CLIENTES_MOTIONS,
    title: TABS_CLIENTES_MOTIONS,
    icon: 'mdi mdi-animation-play'
  }
];

const Cliente = memo(function Cliente() {
  const {cliente} = useParams<{cliente: string}>();
  return (
    <ToastWrapper>
      <PageBreadcrumb title={cliente ?? 'Cliente'} />
      <Row>
        <TableroNoticias />
        <Col className="px-0 px-lg-2">
          <Card>
            <Card.Body>
              <Tab.Container defaultActiveKey={TABS_CLIENTES_PPTS}>
                <Nav variant="pills" justify className="bg-nav-pills">
                  {tabContents.map((tab, index) => {
                    return (
                      <Nav.Item key={index.toString()}>
                        <Nav.Link className="d-flex justify-content-center gap-1" as={Link} to="" eventKey={tab.title}>
                          <i className={`${tab.icon} d-inline-block`}></i>
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
                        <Row className="mt-1">
                          <Col xs={12}>
                            {tab.id === TABS_CLIENTES_PPTS && <Ppts />}
                            {tab.id === TABS_CLIENTES_MOTIONS && <Motions />}
                          </Col>
                        </Row>
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ToastWrapper>
  );
});

export {Cliente};
