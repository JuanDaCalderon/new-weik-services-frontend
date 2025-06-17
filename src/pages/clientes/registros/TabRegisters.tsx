import {memo} from 'react';
import TabRegisterContainer from '@/pages/clientes/TabRegisterContainer';
import {Registros} from './Registros';
import {RegistrosProps} from '@/types';

const TabRegisters = memo(function TabRegisters({registerType, customFields = []}: RegistrosProps) {
  return (
    <TabRegisterContainer
      registerComponent={<Registros registerType={registerType} customFields={customFields} />}
      reportComponent={<p>{registerType}</p>}
    />
  );
});

export default TabRegisters;
