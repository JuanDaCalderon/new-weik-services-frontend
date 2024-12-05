import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import classNames from 'classnames';
import {useToggle} from '@/hooks';
import {memo, useMemo} from 'react';
import {ProfileOption} from '@/types';
import {PAGE_LOG_OUT, PAGE_PROFILE} from '@/constants';
import fallBackLogo from '@/assets/images/logo.png';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
const profileMenus: ProfileOption[] = [
  {
    label: 'Mi cuenta',
    icon: 'mdi mdi-account-circle',
    redirectTo: PAGE_PROFILE
  },
  {
    label: 'Roles y Permisos',
    icon: 'mdi mdi-account-edit',
    redirectTo: '#'
  },
  {
    label: 'Cerrar sesión',
    icon: 'mdi mdi-logout',
    redirectTo: PAGE_LOG_OUT
  }
];

const ProfileDropdown = () => {
  const [isOpen, toggleDropdown] = useToggle();
  const {email, roles, userName, nombres, apellidos, userImage} = useAppSelector(selectUser);

  const rolesText: string = useMemo(() => {
    return roles.reduce((acc, rol) => {
      return `${acc} ${rol.rol}-`;
    }, '');
  }, [roles]);

  const title: string = useMemo(() => {
    if (rolesText !== '') return rolesText;
    else if (userName !== '') return userName;
    else if (nombres !== '' || apellidos !== '') return `${nombres} ${apellidos}`;
    else return email;
  }, [apellidos, email, nombres, rolesText, userName]);

  const userImg: string = useMemo(() => {
    if (userImage && userImage !== '') return userImage;
    else return fallBackLogo;
  }, [userImage]);

  return (
    <Dropdown show={isOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        variant="link"
        id="dropdown-profile"
        as={'button'}
        onClick={toggleDropdown}
        className="nav-link dropdown-toggle arrow-none nav-user px-2">
        <span className="account-user-avatar">
          <img src={userImg} className="rounded-circle" width={32} alt="user" loading="lazy" />
        </span>
        <span className="d-lg-flex flex-column gap-1 d-none">
          <h5 className="my-0 align-self-start">{title}</h5>
          <h6 className="my-0 fw-normal align-self-start">{email}</h6>
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu align={'end'} className="dropdown-menu-animated profile-dropdown">
        <div onClick={toggleDropdown}>
          <div className="dropdown-header noti-title">
            <h6 className="text-overflow m-0">Bienvenido!</h6>
          </div>
          {profileMenus.map((item, i) => {
            return (
              <Link
                to={item.redirectTo}
                className="dropdown-item notify-item"
                key={i + '-profile-menu'}>
                <i className={classNames(item.icon, 'me-1')}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default memo(ProfileDropdown);
