import {INTERNAL_PATH, NOTFOUND_PATH, NOTFOUND_ROUTER_PATH} from '@/constants';
import DefaultLayout from '@/layouts/Default';
import {lazy} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

const PageNotFound = lazy(() => import('./PageNotFound'));
const InternalError = lazy(() => import('./InternalError'));

const ErrorPages = () => {
  return (
    <Routes>
      <Route path="/*" element={<DefaultLayout />}>
        <Route index element={<InternalError />} />
        <Route path={NOTFOUND_PATH} element={<PageNotFound />} />
        <Route path={INTERNAL_PATH} element={<InternalError />} />
        <Route path="*" element={<Navigate to={NOTFOUND_ROUTER_PATH} />} />
      </Route>
    </Routes>
  );
};

export default ErrorPages;
