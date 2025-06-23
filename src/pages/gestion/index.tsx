import {CLIENTES_PATH, NOTICIAS_PATH, OFICINA_PATH, USUARIOS_PATH} from '@/constants';
import Root from '@/routes/Root';
import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const Clientes = lazy(() => import('@/pages/gestion/clientes'));
const Usuarios = lazy(() => import('@/pages/gestion/usuarios'));
const Noticias = lazy(() => import('@/pages/gestion/noticias'));
const Oficina = lazy(() => import('@/pages/gestion/oficina'));
const Error404Alt = lazy(() => import('@/pages/otherpages/Error404Alt'));

export default function Gestion() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route index element={<Root />} />
        <Route path={CLIENTES_PATH} element={<Clientes />} />
        <Route path={USUARIOS_PATH} element={<Usuarios />} />
        <Route path={NOTICIAS_PATH} element={<Noticias />} />
        <Route path={`${OFICINA_PATH}/*`} element={<Oficina />} />
        <Route path="*" element={<Error404Alt />} />
      </Route>
    </Routes>
  );
}
