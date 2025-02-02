import Root from '@/routes/Root';
import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const Clientes = lazy(() => import('@/pages/gestion/clientes'));
const Usuarios = lazy(() => import('@/pages/gestion/usuarios'));
const Error404Alt = lazy(() => import('../otherpages/Error404Alt'));

export default function Gestion() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route index element={<Root />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="*" element={<Error404Alt />} />
      </Route>
    </Routes>
  );
}
