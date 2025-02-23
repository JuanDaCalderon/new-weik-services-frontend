import {lazy} from 'react';
import {Route, Routes as ReactRoutes, Navigate} from 'react-router-dom';
import HorizontalLayout from '@/layouts/Horizontal';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores/user';
import {DEFAULT_ROUTER_PATH} from '@/constants';

const Home = lazy(() => import('@/pages/home'));
const Error404Alt = lazy(() => import('@/pages/otherpages/Error404Alt'));

export default function ProtectedHomeRoutes() {
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  if (isLoggedIn) {
    return (
      <ReactRoutes>
        <Route path="/*" element={<HorizontalLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Error404Alt />} />
        </Route>
      </ReactRoutes>
    );
  } else return <Navigate to={DEFAULT_ROUTER_PATH} />;
}
