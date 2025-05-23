import {memo} from 'react';
import {TabRegisterContainer} from '@/pages/clientes/TabRegisterContainer';

const Motions = memo(function Motions() {
  return <TabRegisterContainer registerComponent={<p>hola motion</p>} reportComponent={<p>hola reporte</p>} />;
});

export {Motions};
