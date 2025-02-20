import {Link} from 'react-router-dom';
import ProfileDropdown from '@/layouts/Topbar/ProfileDropdown';
import AppsDropdown from '@/layouts/Topbar/AppsDropdown';
import {OverlayTrigger, Tooltip, Image} from 'react-bootstrap';
import logo from '@/assets/images/logo.png';
import logoSm from '@/assets/images/logo-sm.png';
import {useThemeContext} from '@/common';
import {THEME, LOCALSTORAGE_THEME_MODE_KEY} from '@/constants';
import {useCallback} from 'react';
import {TopbarProps} from '@/types';
import {LocalStorageUtil} from '@/utils';

const Topbar = ({toggleMenu, navOpen}: TopbarProps) => {
  const {settings, updateSettings} = useThemeContext();

  const toggleDarkMode = useCallback(() => {
    if (settings.theme === THEME.dark) {
      updateSettings({theme: THEME.light});
      LocalStorageUtil.setItem<THEME>(LOCALSTORAGE_THEME_MODE_KEY, THEME.light);
    } else {
      updateSettings({theme: THEME.dark});
      LocalStorageUtil.setItem<THEME>(LOCALSTORAGE_THEME_MODE_KEY, THEME.dark);
    }
  }, [settings.theme, updateSettings]);

  const toggleRightSideBar = useCallback(() => {
    updateSettings({rightSidebar: {toggle: true}});
  }, [updateSettings]);

  return (
    <div className="navbar-custom">
      <div className="topbar container-fluid">
        <div className="d-flex align-items-center gap-lg-2 gap-1">
          <div className="logo-topbar">
            <Link to="/" className="logo-light">
              <span className="logo-lg">
                <Image src={logo} alt="logo" loading="lazy" />
              </span>
              <span className="logo-sm">
                <Image src={logoSm} alt="small logo" loading="lazy" />
              </span>
            </Link>
          </div>

          <button className={`navbar-toggle ${navOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <div className="lines">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
        <ul className="topbar-menu d-flex align-items-center gap-3">
          <li className="dropdown d-none d-sm-inline-block">
            <AppsDropdown />
          </li>
          <li className="d-none d-sm-inline-block">
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="dark-mode-toggler">Centro de operaciones</Tooltip>}>
              <button
                className="nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none"
                onClick={toggleRightSideBar}>
                <i className="ri-24-hours-line font-22"></i>
              </button>
            </OverlayTrigger>
          </li>
          <li className="d-none d-sm-inline-block">
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="dark-mode-toggler">Tema</Tooltip>}>
              <div className="nav-link" id="light-dark-mode" onClick={toggleDarkMode}>
                <i className="ri-moon-line font-22" />
              </div>
            </OverlayTrigger>
          </li>
          <li className="dropdown">
            <ProfileDropdown />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Topbar;
