import {Link} from 'react-router-dom';
import {notifications, profileMenus} from './data';
import LanguageDropdown from './LanguageDropdown';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SearchDropdown from './SearchDropdown';
import AppsDropdown from './AppsDropdown';
import MaximizeScreen from './MaximizeScreen';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

// assets
import userImage from '@/assets/images/users/avatar-1.jpg';
import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logo-dark.png';
import logoSm from '@/assets/images/logo-sm.png';
import logoDarkSm from '@/assets/images/logo-dark-sm.png';
import {ThemeSettings, useThemeContext} from '@/common';

type TopbarProps = {
  topbarDark?: boolean;
  toggleMenu?: () => void;
  navOpen?: boolean;
};

const Topbar = ({topbarDark, toggleMenu, navOpen}: TopbarProps) => {
  const {settings, updateSettings} = useThemeContext();

  /**
   * Toggle Dark Mode
   */
  const toggleDarkMode = () => {
    if (settings.theme === 'dark') {
      updateSettings({theme: ThemeSettings.theme.light});
    } else {
      updateSettings({theme: 'dark'});
    }
  };

  return (
    <div className={'navbar-custom'}>
      <div className="topbar container-fluid">
        <div className="d-flex align-items-center gap-lg-2 gap-1">
          <div className="logo-topbar">
            <Link to="/" className={topbarDark ? 'logo-light' : 'logo-dark'}>
              <span className="logo-lg">
                <img src={topbarDark ? logo : logoDark} alt="logo" />
              </span>
              <span className="logo-sm">
                <img src={topbarDark ? logoSm : logoDarkSm} alt="small logo" />
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
          <li className="dropdown d-lg-none">
            <SearchDropdown />
          </li>
          <li className="dropdown">
            <LanguageDropdown />
          </li>
          <li className="dropdown notification-list">
            <NotificationDropdown notifications={notifications} />
          </li>
          <li className="dropdown d-none d-sm-inline-block">
            <AppsDropdown />
          </li>
          <li className="d-none d-sm-inline-block">
            <button
              className="nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none"
              onClick={() => {}}>
              <i className="ri-settings-3-line font-22"></i>
            </button>
          </li>

          <li className="d-none d-sm-inline-block">
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip id="dark-mode-toggler">Theme Mode</Tooltip>}>
              <div className="nav-link" id="light-dark-mode" onClick={toggleDarkMode}>
                <i className="ri-moon-line font-22" />
              </div>
            </OverlayTrigger>
          </li>

          <li className="d-none d-md-inline-block">
            <MaximizeScreen />
          </li>

          <li className="dropdown">
            <ProfileDropdown
              userImage={userImage}
              menuItems={profileMenus}
              username={'Dominic Keller'}
              userTitle={'Founder'}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Topbar;
