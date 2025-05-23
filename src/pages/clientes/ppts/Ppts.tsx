import {memo} from 'react';
import {TabRegisterContainer} from '@/pages/clientes/TabRegisterContainer';
import {Registros} from './Registros';

const Ppts = memo(function Ppts() {
  return <TabRegisterContainer registerComponent={<Registros />} reportComponent={<p>hola reporte</p>} />;
});

export {Ppts};
