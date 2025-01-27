import Root from '@/routes/Root';
import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const CrearClientes = lazy(() => import('./crear'));
const Error404Alt = lazy(() => import('../../otherpages/Error404Alt'));

export default function Clientes() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route index element={<Root />} />
        <Route path="crearcliente" element={<CrearClientes />} />
        <Route path="*" element={<Error404Alt />} />
      </Route>
    </Routes>
  );
}
