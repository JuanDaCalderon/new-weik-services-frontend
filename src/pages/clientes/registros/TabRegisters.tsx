import {memo} from 'react';
import {Registros} from './Registros';
import {RegistrosProps} from '@/types';

const TabRegisters = memo(function TabRegisters({registerType, customFields = []}: RegistrosProps) {
  return <Registros registerType={registerType} customFields={customFields} />;
});

export default TabRegisters;
