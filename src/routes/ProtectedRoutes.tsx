import {lazy} from 'react';
import {Route, Routes as ReactRoutes, Navigate} from 'react-router-dom';
import HorizontalLayout from '@/layouts/Horizontal';
import Root from '@/routes/Root';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores/user';
import {DEFAULT_ROUTER_PATH} from '@/constants';
/* NEW PAGES */
const Profile = lazy(() => import('@/pages/perfil'));
const RolesYPermisos = lazy(() => import('@/pages/rolesypermisos'));
const Gestion = lazy(() => import('@/pages/gestion'));
const Clientes = lazy(() => import('@/pages/clientes'));
/* NEW PAGES */

const Dashboard = lazy(() => import('../pages/dashboard'));
const Apps = lazy(() => import('../pages/apps'));
const OtherPages = lazy(() => import('../pages/otherpages'));
const UI = lazy(() => import('../pages/ui'));
const Error404Alt = lazy(() => import('../pages/otherpages/Error404Alt'));

export default function ProtectedRoutes() {
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  if (isLoggedIn) {
    return (
      <ReactRoutes>
        <Route path="/*" element={<HorizontalLayout />}>
          <Route index element={<Root />} />
          {/* NEW PAGES */}
          <Route path="perfil" element={<Profile />} />
          <Route path="rolesypermisos" element={<RolesYPermisos />} />
          <Route path="gestion/*" element={<Gestion />} />
          <Route path="clientes/:cliente" element={<Clientes />} />
          {/* NEW PAGES */}
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="apps/*" element={<Apps />} />
          <Route path="pages/*" element={<OtherPages />} />
          <Route path="ui/*" element={<UI />} />
          <Route path="*" element={<Error404Alt />} />
        </Route>
      </ReactRoutes>
    );
  } else return <Navigate to={DEFAULT_ROUTER_PATH} />;
}
