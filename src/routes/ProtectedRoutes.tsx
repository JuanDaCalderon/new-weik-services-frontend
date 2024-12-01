import {lazy} from 'react';
import {Route, Routes as ReactRoutes, Navigate} from 'react-router-dom';
import HorizontalLayout from '@/layouts/Horizontal';
import Root from './Root';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores/user';
import {DEFAULT_ROUTER_PATH} from '@/constants';

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
