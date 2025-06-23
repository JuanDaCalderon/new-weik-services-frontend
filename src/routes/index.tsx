import {Route, Routes as ReactRoutes, Navigate} from 'react-router-dom';
import Root from '@/routes/Root';
import Account from '@/pages/account';
import ErrorPages from '@/pages/error';
import ProtectedRoutes from '@/routes/ProtectedRoutes';
import ProtectedHomeRoutes from '@/routes/ProtectedHomeRoutes';
import {
  ACCOUNT_ROUTER_PATH,
  ERROR_ROUTER_PATH,
  HOME_ROUTER_PATH,
  NOTFOUND_ROUTER_PATH,
  SERVICES_ROUTER_PATH
} from '@/constants';
import {useEffect} from 'react';
import {changeHTMLAttribute} from '@/utils';
import {useThemeContext} from '@/common/context';

export default function AppRoutes() {
  const {settings} = useThemeContext();
  useEffect(() => changeHTMLAttribute('data-bs-theme', settings.theme), [settings.theme]);

  return (
    <ReactRoutes>
      <Route index element={<Root />}></Route>
      <Route path={`${ACCOUNT_ROUTER_PATH}/*`} element={<Account />} />
      <Route path={`${ERROR_ROUTER_PATH}/*`} element={<ErrorPages />} />
      <Route path={`${SERVICES_ROUTER_PATH}/*`} element={<ProtectedRoutes />} />
      <Route path={`${HOME_ROUTER_PATH}/*`} element={<ProtectedHomeRoutes />} />
      <Route path="*" element={<Navigate to={NOTFOUND_ROUTER_PATH} />} />
    </ReactRoutes>
  );
}
