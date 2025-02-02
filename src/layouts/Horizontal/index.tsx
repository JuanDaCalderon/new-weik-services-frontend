import React, {Suspense, useEffect, useMemo, JSX} from 'react';
import {Outlet} from 'react-router-dom';
import {Container} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {useThemeContext} from '@/common/context';
import {changeHTMLAttribute, getBoolean} from '@/utils';
import config from '@/config';
import packageJson from '../../../package.json';

const Topbar = React.lazy(() => import('@/layouts/Topbar'));
const Navbar = React.lazy(() => import('@/layouts/Horizontal/Navbar'));
const Footer = React.lazy(() => import('@/layouts/Footer'));
const RightSidebar = React.lazy(() => import('@/layouts/RightSidebar'));

const loading = () => <div className="text-center"></div>;

const HorizontalLayout = () => {
  const {settings} = useThemeContext();
  const [horizontalDropdownOpen, toggleMenu] = useToggle();

  useEffect(() => {
    changeHTMLAttribute('data-layout', 'topnav');
    return () => {
      document.getElementsByTagName('html')[0].removeAttribute('data-layout');
    };
  }, []);

  useEffect(() => {
    changeHTMLAttribute('data-bs-theme', settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    changeHTMLAttribute('data-layout-mode', settings.layout.mode);
  }, [settings.layout.mode]);

  useEffect(() => {
    changeHTMLAttribute('data-menu-color', settings.sidebar.theme);
  }, [settings.sidebar.theme]);

  useEffect(() => {
    changeHTMLAttribute('data-topbar-color', settings.topbar.theme);
  }, [settings.topbar.theme]);

  useEffect(() => {
    changeHTMLAttribute('data-layout-position', settings.layout.menuPosition);
  }, [settings.layout.menuPosition]);

  const TestBox: JSX.Element = useMemo(() => {
    if (getBoolean(config.IS_TESTING ?? 'false'))
      return (
        <div
          className="alert alert-info position-fixed bottom-0"
          role="alert"
          style={{zIndex: '9999'}}>
          <span className="text-primary">TEST ENV - {packageJson.version}</span>
        </div>
      );
    else return <></>;
  }, []);

  return (
    <div className="wrapper">
      <Suspense fallback={loading()}>
        <Topbar toggleMenu={toggleMenu} navOpen={horizontalDropdownOpen} />
      </Suspense>

      <Suspense fallback={loading()}>
        <Navbar isMenuOpened={horizontalDropdownOpen} />
      </Suspense>

      <div className="content-page">
        <div className="content">
          <Container fluid>
            <Suspense fallback={loading()}>
              <Outlet />
            </Suspense>
          </Container>
        </div>

        <Suspense fallback={loading()}>
          <Footer />
        </Suspense>

        <Suspense fallback={loading()}>
          <RightSidebar />
        </Suspense>
      </div>
      {TestBox}
    </div>
  );
};

export default HorizontalLayout;
