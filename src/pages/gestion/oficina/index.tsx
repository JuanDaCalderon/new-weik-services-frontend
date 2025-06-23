import {EVENTOS_PATH, HORARIOS_PATH, REPORTES_PATH, VACACIONES_PATH} from '@/constants';
import Root from '@/routes/Root';
import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const HorarioCalendario = lazy(() => import('@/pages/gestion/oficina/horario'));
const EventosCalendar = lazy(() => import('@/pages/gestion/oficina/eventos'));
const Vacaciones = lazy(() => import('@/pages/gestion/oficina/vacaciones'));
const Reportes = lazy(() => import('@/pages/gestion/oficina/reportes'));
const Error404Alt = lazy(() => import('@/pages/otherpages/Error404Alt'));

export default function Ofina() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route index element={<Root />} />
        <Route path={HORARIOS_PATH} element={<HorarioCalendario />} />
        <Route path={EVENTOS_PATH} element={<EventosCalendar />} />
        <Route path={VACACIONES_PATH} element={<Vacaciones />} />
        <Route path={REPORTES_PATH} element={<Reportes />} />
        <Route path="*" element={<Error404Alt />} />
      </Route>
    </Routes>
  );
}
