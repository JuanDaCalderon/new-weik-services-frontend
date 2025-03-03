import React, {Suspense, useEffect, useMemo, JSX, useCallback, useRef, useState, MouseEvent} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {Alert, Container} from 'react-bootstrap';
import {useToggle, useTogglev2} from '@/hooks';
import {useThemeContext} from '@/common/context';
import {changeHTMLAttribute, getBoolean} from '@/utils';
import config from '@/config';
import packageJson from '../../../package.json';
import {useAppSelector} from '@/store';
import {isUserLoggedInSelector} from '@/store/selectores';
import {LocalStorageUtil} from '@/utils';
import {ALERT_TIMEOUT_MS, LOCALSTORAGE_LOG_OUT_ALERT, PAGE_LOG_OUT} from '@/constants';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const Topbar = React.lazy(() => import('@/layouts/Topbar'));
const Navbar = React.lazy(() => import('@/layouts/Horizontal/Navbar'));
const Footer = React.lazy(() => import('@/layouts/Footer'));
const RightSidebar = React.lazy(() => import('@/layouts/RightSidebar'));

const loadingTopNav = () => <SkeletonLoader customClass="p-0 m-0 w-100" height="var(--ct-topbar-height)" />;
const loadingNavBar = () => <SkeletonLoader customClass="p-0 pt-1 m-0 w-100" height="45px" />;
const defaultLoading = () => <SkeletonLoader customClass="p-1 m-0 w-100" />;

const HorizontalLayout = () => {
  const isLoggedIn = useAppSelector(isUserLoggedInSelector);
  const {settings} = useThemeContext();
  const [timeoutId, setTimeoutId] = useState<{timeOut: NodeJS.Timeout | null; wasEmited: boolean}>({
    timeOut: null,
    wasEmited: false
  });
  const [horizontalDropdownOpen, toggleMenu] = useToggle();
  const {isOpen, show, hide} = useTogglev2();
  const navigate = useNavigate();
  const wasHidden = useRef(false);

  useEffect(() => {
    if (timeoutId.wasEmited && timeoutId.timeOut) clearTimeout(timeoutId.timeOut);

    return () => {
      if (timeoutId.timeOut) clearTimeout(timeoutId.timeOut);
    };
  }, [timeoutId.timeOut, timeoutId.wasEmited]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') wasHidden.current = true;
      else wasHidden.current = false;
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (wasHidden.current && isLoggedIn) {
        show();
        const alertIsShown = LocalStorageUtil.getItem<boolean>(LOCALSTORAGE_LOG_OUT_ALERT);
        if (!alertIsShown) {
          LocalStorageUtil.setItem<boolean>(LOCALSTORAGE_LOG_OUT_ALERT, true);
          event.preventDefault();
          event.returnValue = '';
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLoggedIn, show]);

  useEffect(() => {
    changeHTMLAttribute('data-layout', 'topnav');
    if (LocalStorageUtil.getItem<boolean>(LOCALSTORAGE_LOG_OUT_ALERT)) show();
    return () => document.getElementsByTagName('html')[0].removeAttribute('data-layout');
  }, [show]);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    changeHTMLAttribute('data-layout-mode', settings.layout.mode);
    changeHTMLAttribute('data-menu-color', settings.sidebar.theme);
    changeHTMLAttribute('data-topbar-color', settings.topbar.theme);
    changeHTMLAttribute('data-layout-position', settings.layout.menuPosition);
  }, [settings.layout.menuPosition, settings.layout.mode, settings.sidebar.theme, settings.topbar.theme]);

  const TestBox: JSX.Element = useMemo(
    () =>
      getBoolean(config.IS_TESTING ?? 'false') ? (
        <div className="alert alert-info position-fixed bottom-0" role="alert" style={{zIndex: '9999'}}>
          <span className="text-primary">TEST ENV - {packageJson.version}</span>
        </div>
      ) : (
        <></>
      ),
    []
  );

  const onClose = useCallback(() => {
    hide();
    LocalStorageUtil.setItem<boolean>(LOCALSTORAGE_LOG_OUT_ALERT, false);

    const id = setTimeout(() => {
      show();
      LocalStorageUtil.setItem<boolean>(LOCALSTORAGE_LOG_OUT_ALERT, true);
      setTimeoutId((prev) => ({...prev, wasEmited: true}));
    }, ALERT_TIMEOUT_MS);

    setTimeoutId({timeOut: id, wasEmited: false});
  }, [hide, show]);

  const onLogOut = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(PAGE_LOG_OUT);
    },
    [navigate]
  );

  return (
    <div className="wrapper">
      <Suspense fallback={loadingTopNav()}>
        <Topbar toggleMenu={toggleMenu} navOpen={horizontalDropdownOpen} />
      </Suspense>

      <Suspense fallback={loadingNavBar()}>
        <Navbar isMenuOpened={horizontalDropdownOpen} />
      </Suspense>

      <div className="content-page">
        <div className="content">
          <Alert show={isOpen} className="m-0 py-2 px-4 w-100 rounded-0" variant="danger" dismissible onClose={onClose}>
            <span style={{marginLeft: '8px'}}>
              Recuerda cerrar sesión y actualizar tu estado para mantener la información precisa. Así evitarás aparecer
              en línea cuando no lo estés. Puedes hacerlo directamente desde aquí, antes asegúrate de finalizar tu
              jornada laboral.
              <a href="#" className="ms-1 link-danger text-decoration-underline" onClick={onLogOut}>
                Cerrar sesión
              </a>
            </span>
          </Alert>
          <Container fluid>
            <Suspense fallback={defaultLoading()}>
              <Outlet />
            </Suspense>
          </Container>
        </div>

        <Suspense fallback={defaultLoading()}>
          <Footer />
        </Suspense>

        <Suspense fallback={defaultLoading()}>
          <RightSidebar />
        </Suspense>
      </div>
      {TestBox}
    </div>
  );
};

export default HorizontalLayout;
