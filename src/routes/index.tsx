import {Route, Routes as ReactRoutes, Navigate} from 'react-router-dom';
import ProtectedRoutes from '@/routes/ProtectedRoutes';
import Root from '@/routes/Root';
import ErrorPages from '@/pages/error';
import Account from '@/pages/account';
import {PAGE_NOT_FOUND_PATH} from '@/constants';

export default function AppRoutes() {
  return (
    <ReactRoutes>
      <Route index element={<Root />}></Route>
      <Route path="/account/*" element={<Account />} />
      <Route path="/error/*" element={<ErrorPages />} />
      <Route path="/services/*" element={<ProtectedRoutes />} />
      <Route path="*" element={<Navigate to={PAGE_NOT_FOUND_PATH} />} />
    </ReactRoutes>
  );
}
