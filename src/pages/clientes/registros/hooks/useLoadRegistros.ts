import {useCallback, useEffect, useState} from 'react';
import {SessionStorageUtil} from '@/utils';
import {SESSIONSTORAGE_LOAD_PENDING_RECORDS, SESSIONSTORAGE_LOAD_DELIVERED_RECORDS} from '@/constants';
import useGetRegistros from '@/endpoints/db/registros/useGetRegistros';
import useClearRegistros from '@/endpoints/db/registros/useClearRegistros';
import {CheckRecordsState} from '@/pages/clientes/registros/types/registros';

export const useLoadRegistros = (cliente: string | undefined, registerType: string, registrosLength: number) => {
  const [checkRecords, setCheckRecords] = useState<CheckRecordsState>({
    checkPendingRecords: SessionStorageUtil.getItem<boolean>(SESSIONSTORAGE_LOAD_PENDING_RECORDS) ?? true,
    checkDeliveredRecords: SessionStorageUtil.getItem<boolean>(SESSIONSTORAGE_LOAD_DELIVERED_RECORDS) ?? false
  });
  const {getRegistroPerClienteTypeListener, unsubscribeClienteTipo} = useGetRegistros();
  const {clearRegistros} = useClearRegistros();

  useEffect(() => {
    if (!cliente) return;
    if (checkRecords.checkPendingRecords && !checkRecords.checkDeliveredRecords) {
      if (registrosLength <= 0) {
        getRegistroPerClienteTypeListener(cliente, registerType, false);
        return;
      }
    }
    if (checkRecords.checkDeliveredRecords && !checkRecords.checkPendingRecords) {
      if (registrosLength <= 0) {
        getRegistroPerClienteTypeListener(cliente, registerType, true);
        return;
      }
    }
  }, [
    checkRecords.checkDeliveredRecords,
    checkRecords.checkPendingRecords,
    cliente,
    getRegistroPerClienteTypeListener,
    registerType,
    registrosLength
  ]);

  const refreashRegistros = useCallback(async () => {
    if (!cliente) return;
    unsubscribeClienteTipo(cliente, registerType);
    clearRegistros(cliente, registerType);
    if (checkRecords.checkPendingRecords && !checkRecords.checkDeliveredRecords) {
      getRegistroPerClienteTypeListener(cliente, registerType, false);
      return;
    }
    if (checkRecords.checkDeliveredRecords && !checkRecords.checkPendingRecords) {
      getRegistroPerClienteTypeListener(cliente, registerType, true);
      return;
    }
  }, [
    checkRecords.checkDeliveredRecords,
    checkRecords.checkPendingRecords,
    clearRegistros,
    cliente,
    getRegistroPerClienteTypeListener,
    registerType,
    unsubscribeClienteTipo
  ]);

  const toggleCheck = (type: 'pending' | 'delivered', checked: boolean) => {
    if (!cliente) return;
    if (type === 'pending' && !checkRecords.checkDeliveredRecords) return;
    if (type === 'delivered' && !checkRecords.checkPendingRecords) return;
    clearRegistros(cliente, registerType);
    const newState: CheckRecordsState =
      type === 'pending'
        ? {checkPendingRecords: checked, checkDeliveredRecords: false}
        : {checkPendingRecords: false, checkDeliveredRecords: checked};

    setCheckRecords(newState);
    SessionStorageUtil.setItem(SESSIONSTORAGE_LOAD_PENDING_RECORDS, newState.checkPendingRecords);
    SessionStorageUtil.setItem(SESSIONSTORAGE_LOAD_DELIVERED_RECORDS, newState.checkDeliveredRecords);
  };

  return {
    checkRecords,
    toggleCheck,
    refreashRegistros
  };
};
