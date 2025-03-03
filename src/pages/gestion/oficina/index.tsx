import Root from '@/routes/Root';
import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const Horarios = lazy(() => import('@/pages/gestion/oficina/horarios'));
const Error404Alt = lazy(() => import('@/pages/otherpages/Error404Alt'));

export default function Ofina() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route index element={<Root />} />
        <Route path="horarios" element={<Horarios />} />
        <Route path="*" element={<Error404Alt />} />
      </Route>
    </Routes>
  );
}
