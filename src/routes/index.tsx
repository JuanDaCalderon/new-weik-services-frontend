import {Route, Routes as ReactRoutes, Navigate} from 'react-router-dom';
import Root from '@/routes/Root';
import Account from '@/pages/account';
import ErrorPages from '@/pages/error';
import ProtectedRoutes from '@/routes/ProtectedRoutes';
import ProtectedHomeRoutes from '@/routes/ProtectedHomeRoutes';
import {PAGE_NOT_FOUND_PATH} from '@/constants';
import {useEffect} from 'react';
import {changeHTMLAttribute} from '@/utils';
import {useThemeContext} from '@/common/context';

export default function AppRoutes() {
  const {settings} = useThemeContext();

  useEffect(() => {
    changeHTMLAttribute('data-bs-theme', settings.theme);
  }, [settings.theme]);

  return (
    <ReactRoutes>
      <Route index element={<Root />}></Route>
      <Route path="/account/*" element={<Account />} />
      <Route path="/error/*" element={<ErrorPages />} />
      <Route path="/services/*" element={<ProtectedRoutes />} />
      <Route path="/home/*" element={<ProtectedHomeRoutes />} />
      <Route path="*" element={<Navigate to={PAGE_NOT_FOUND_PATH} />} />
    </ReactRoutes>
  );
}
