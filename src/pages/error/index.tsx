import {PAGE_NOT_FOUND_PATH} from '@/constants';
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
        <Route path="notFound" element={<PageNotFound />} />
        <Route path="internal" element={<InternalError />} />
        <Route path="*" element={<Navigate to={PAGE_NOT_FOUND_PATH} />} />
      </Route>
    </Routes>
  );
};

export default ErrorPages;
