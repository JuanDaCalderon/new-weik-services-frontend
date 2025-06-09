import {memo, JSX, useMemo, lazy, Suspense, useState} from 'react';
import {PageBreadcrumb} from '@/components';
import {TableroNoticias} from '@/components/Noticias';
import {ToastWrapper} from '@/components/Toast';
import {Cliente as ClienteType, TabContentItem} from '@/types';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import {useAppSelector} from '@/store';
import {selectClientes, selectNoticiasIsExpanded} from '@/store/selectores';
const TabRegisters = lazy(() => import('@/pages/clientes/registros/TabRegisters'));

const Cliente = memo(function Cliente() {
  const tableroNoticiasIsExpanded = useAppSelector(selectNoticiasIsExpanded);
  const {cliente} = useParams<{cliente: string}>();
  const clientes = useAppSelector(selectClientes);
  const {tiposRegistros} = useMemo(() => {
    return clientes.find((c) => c.domain === cliente) || ({tiposRegistros: []} as unknown as ClienteType);
  }, [cliente, clientes]);
  const [tabContents] = useState<TabContentItem[]>(
    tiposRegistros.map((tipoRegistro) => {
      return {
        id: tipoRegistro.tipo.toUpperCase(),
        title: tipoRegistro.tipo.toUpperCase()
      };
    })
  );
  const tabComponentsMap: Record<string, JSX.Element> = useMemo(() => {
    return tabContents.reduce(
      (acc, tab) => {
        acc[tab.id] = (
          <Suspense fallback={<div>Loading...</div>}>
            <TabRegisters registerType={tab.id} />
          </Suspense>
        );
        return acc;
      },
      {} as Record<string, JSX.Element>
    );
  }, [tabContents]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title={cliente ?? 'Cliente'} />
      <Row>
        <TableroNoticias />
        <Col
          xs={12}
          xl={tableroNoticiasIsExpanded ? 9 : 10}
          xxl={tableroNoticiasIsExpanded ? 10 : 11}
          className="px-0 px-xl-2">
          <Card>
            <Card.Body>
              <Tab.Container defaultActiveKey={tabContents[0].id}>
                <Nav variant="pills" justify className="bg-nav-pills">
                  {tabContents.map((tab, index) => {
                    return (
                      <Nav.Item key={index.toString()}>
                        <Nav.Link className="d-flex justify-content-center gap-1" as={Link} to="" eventKey={tab.title}>
                          <span className="d-block">{tab.title}</span>
                        </Nav.Link>
                      </Nav.Item>
                    );
                  })}
                </Nav>
                <Tab.Content>
                  {tabContents.map((tab, index) => (
                    <Tab.Pane eventKey={tab.title} id={tab.id} key={index.toString()}>
                      <Row>
                        <Col xs={12}>{tabComponentsMap[tab.id]}</Col>
                      </Row>
                    </Tab.Pane>
                  ))}
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
