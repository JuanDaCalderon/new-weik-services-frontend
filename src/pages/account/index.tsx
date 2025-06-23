import {
  CONFIRM_PATH,
  EMAIL_RECOVERY_QUERY_PARAM,
  LOGIN_PATH,
  LOGOUT_PATH,
  NOTFOUND_ROUTER_PATH,
  RECOVERY_PATH
} from '@/constants';
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
        <Route path={LOGIN_PATH} element={<Login />} />
        <Route path={LOGOUT_PATH} element={<Logout />} />
        <Route path={RECOVERY_PATH} element={<RecoverPassword />} />
        <Route path={`${CONFIRM_PATH}/:${EMAIL_RECOVERY_QUERY_PARAM}`} element={<ConfirmMail />} />
        <Route path="*" element={<Navigate to={NOTFOUND_ROUTER_PATH} />} />
      </Route>
    </Routes>
  );
}
