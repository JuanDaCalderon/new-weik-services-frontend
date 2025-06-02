import {memo} from 'react';
import TabRegisterContainer from '@/pages/clientes/TabRegisterContainer';
import {Registros} from './Registros';
import {RegistrosProps} from '@/types';

const TabRegisters = memo(function TabRegisters({registerType}: RegistrosProps) {
  return (
    <TabRegisterContainer
      registerComponent={<Registros registerType={registerType} />}
      reportComponent={<p>{registerType}</p>}
    />
  );
});

export default TabRegisters;
