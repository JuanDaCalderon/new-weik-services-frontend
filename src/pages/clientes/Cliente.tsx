import {memo, JSX, useMemo, lazy, Suspense, useState, useEffect} from 'react';
import {PageBreadcrumb} from '@/components';
import {TableroNoticias} from '@/components/Noticias';
import {ToastWrapper} from '@/components/Toast';
import {Cliente as ClienteType, TabContentItem} from '@/types';
import {Card, Col, Nav, Row, Tab} from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import {useAppSelector} from '@/store';
import {selectClientes, selectNoticiasIsExpanded} from '@/store/selectores';
import {useTranslation} from 'react-i18next';
const TabRegisters = lazy(() => import('@/pages/clientes/registros/TabRegisters'));

const Cliente = memo(function Cliente() {
  const tableroNoticiasIsExpanded = useAppSelector(selectNoticiasIsExpanded);
  const {cliente} = useParams<{cliente: string}>();
  const clientes = useAppSelector(selectClientes);
  const {tiposRegistros} = useMemo(() => {
    return clientes.find((c) => c.domain === cliente) || ({tiposRegistros: []} as unknown as ClienteType);
  }, [cliente, clientes]);
  const [tabContents, setTabContents] = useState<TabContentItem[]>(
    tiposRegistros.map((tipoRegistro) => ({
      id: tipoRegistro.tipo.toUpperCase(),
      title: tipoRegistro.tipo.toUpperCase()
    }))
  );
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const {t} = useTranslation();
  useEffect(() => {
    const newTabs = tiposRegistros.map((tipoRegistro) => ({
      id: tipoRegistro.tipo.toUpperCase(),
      title: tipoRegistro.tipo.toUpperCase()
    }));
    setTabContents(newTabs);
    setActiveTab(newTabs[0]?.id);
  }, [tiposRegistros]);
  const tabComponentsMap: Record<string, JSX.Element> = useMemo(() => {
    return tabContents.reduce(
      (acc, tab) => {
        acc[tab.id] = (
          <Suspense fallback={<div>{t('loading.default')}</div>}>
            <TabRegisters
              registerType={tab.id}
              customFields={
                tiposRegistros.find((tr) => tr.tipo.toLowerCase().trim() === tab.id.toLowerCase().trim())
                  ?.customFields || []
              }
            />
          </Suspense>
        );
        return acc;
      },
      {} as Record<string, JSX.Element>
    );
  }, [t, tabContents, tiposRegistros]);

  return (
    <ToastWrapper>
      <PageBreadcrumb title={cliente ?? t('clientes.cliente.default')} />
      <Row>
        <TableroNoticias />
        <Col
          xs={12}
          xl={tableroNoticiasIsExpanded ? 9 : 10}
          xxl={tableroNoticiasIsExpanded ? 10 : 11}
          className="px-0 px-xl-2">
          <Card>
            <Card.Body>
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k ?? undefined)}>
                <Nav variant="pills" justify className="bg-nav-pills">
                  {tabContents.map((tab, index) => (
                    <Nav.Item key={index.toString()}>
                      <Nav.Link className="d-flex justify-content-center gap-1" as={Link} to="" eventKey={tab.id}>
                        <span className="d-block">{tab.title}</span>
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
                <Tab.Content>
                  {tabContents.map((tab, index) => (
                    <Tab.Pane eventKey={tab.id} id={tab.id} key={index.toString()}>
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
