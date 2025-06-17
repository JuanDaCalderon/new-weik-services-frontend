import {memo, useMemo} from 'react';
import {Dropdown, Form, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {CheckRecordsState} from '@/pages/clientes/registros/types/registros';
import {useTranslation} from 'react-i18next';

type Props = {
  checkRecords: CheckRecordsState;
  onToggleCheck: (type: 'pending' | 'delivered', checked: boolean) => void;
  isLoading: boolean;
};
const LoadRegistros = memo(function LoadRegistros({checkRecords, onToggleCheck, isLoading}: Props) {
  const {t} = useTranslation();

  const titleCopy: string = useMemo(() => {
    let copy = t('clientes.registros.loading');
    if (!isLoading && checkRecords.checkPendingRecords) copy = t('clientes.registros.pending');
    if (!isLoading && checkRecords.checkDeliveredRecords) copy = t('clientes.registros.delivered');
    return copy;
  }, [checkRecords.checkDeliveredRecords, checkRecords.checkPendingRecords, isLoading, t]);

  const titleCopyMobile: string = useMemo(() => {
    let copy = t('loading.default');
    if (!isLoading && checkRecords.checkPendingRecords) copy = t('clientes.registros.mobile.pending');
    if (!isLoading && checkRecords.checkDeliveredRecords) copy = t('clientes.registros.mobile.delivered');
    return copy;
  }, [checkRecords.checkDeliveredRecords, checkRecords.checkPendingRecords, isLoading, t]);
  return (
    <Dropdown>
      <Dropdown.Toggle
        as={Link}
        to=""
        className="arrow-none card-drop d-flex align-items-center justify-content-between">
        <i className="mdi mdi-dots-vertical m-0 p-0" />
        <span className="d-none d-md-inline fw-bold font-14 lh-1 m-0 p-0">{titleCopy}</span>
        <span className="d-none d-sm-inline d-md-none fw-bold font-14 lh-1 m-0 p-0">{titleCopyMobile}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu style={{minWidth: 'max-content', width: 'max-content'}}>
        <Row className="mx-0 my-1 p-0">
          <Col xs={12}>
            <Form.Check
              className="cursor-pointer"
              type="switch"
              id="loadPendingRecords"
              label={t('clientes.registros.load.pending')}
              disabled={isLoading}
              checked={checkRecords.checkPendingRecords}
              onChange={(e) => onToggleCheck('pending', e.target.checked)}
            />
            <Form.Check
              className="cursor-pointer"
              type="switch"
              id="loadDeliveredRecords"
              label={t('clientes.registros.load.delivered')}
              disabled={isLoading}
              checked={checkRecords.checkDeliveredRecords}
              onChange={(e) => onToggleCheck('delivered', e.target.checked)}
            />
          </Col>
        </Row>
      </Dropdown.Menu>
    </Dropdown>
  );
});

export {LoadRegistros};
