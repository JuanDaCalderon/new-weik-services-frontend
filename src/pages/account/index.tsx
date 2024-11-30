import {PAGE_NOT_FOUND_PATH} from '@/constants';
import DefaultLayout from '@/layouts/Default';
import Root from '@/routes/Root';
import {lazy} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';

const Login = lazy(() => import('./Login'));
const Logout = lazy(() => import('./Logout'));
const RecoverPassword = lazy(() => import('./RecoverPassword'));
const ConfirmMail = lazy(() => import('./ConfirmMail'));

export default function Account() {
  return (
    <Routes>
      <Route path="/*" element={<DefaultLayout />}>
        <Route index element={<Root />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="recover-password" element={<RecoverPassword />} />
        <Route path="confirm-mail" element={<ConfirmMail />} />
        <Route path="*" element={<Navigate to={PAGE_NOT_FOUND_PATH} />} />
      </Route>
    </Routes>
  );
}
