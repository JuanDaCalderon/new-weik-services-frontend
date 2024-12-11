import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';

const Profile = lazy(() => import('./Profile'));
const Invoice = lazy(() => import('./Invoice'));
const Error404Alt = lazy(() => import('./Error404Alt'));
const Starter = lazy(() => import('./Starter'));
const Timeline = lazy(() => import('./Timeline'));

export default function OtherPages() {
  return (
    <Routes>
      <Route path="/*" element={<Outlet />}>
        <Route path="profile" element={<Profile />} />
        <Route path="invoice" element={<Invoice />} />
        <Route path="404-alt" element={<Error404Alt />} />
        <Route path="starter" element={<Starter />} />
        <Route path="timeline" element={<Timeline />} />
      </Route>
    </Routes>
  );
}
