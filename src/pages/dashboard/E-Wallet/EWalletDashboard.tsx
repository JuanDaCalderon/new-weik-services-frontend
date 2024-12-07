import {Col, Row} from 'react-bootstrap';
import {PageBreadcrumb} from '@/components';
import MerchantList from './MerchantList';
import TransactionList from './TransactionList';
import {merchantList, transactionList} from './data';

const EWalletDashboard = () => {
  return (
    <>
      <PageBreadcrumb title="E Wallet" subName="Dashboard" />

      <Row>
        <Col xxl={3} md={6}>
          <MerchantList merchantList={merchantList} />
        </Col>
        <Col xxl={6}>
          <TransactionList transactionList={transactionList} />
        </Col>
      </Row>
    </>
  );
};

export {EWalletDashboard};
