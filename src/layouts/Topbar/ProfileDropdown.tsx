import {Link} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
import classNames from 'classnames';
import {useToggle} from '@/hooks';
import {memo, useMemo} from 'react';
import {ProfileOption} from '@/types';
import {PAGE_LOG_OUT, PAGE_PROFILE, PAGE_ROLES_PERMISOS} from '@/constants';
import fallBackLogo from '@/assets/images/logo-fallback.png';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {getNombreCompletoUser} from '@/utils';
const profileMenus: ProfileOption[] = [
  {
    label: 'Mi cuenta',
    icon: 'mdi mdi-account-circle',
    redirectTo: PAGE_PROFILE
  },
  {
    label: 'Roles y Permisos',
    icon: 'mdi mdi-account-edit',
    redirectTo: PAGE_ROLES_PERMISOS,
    permisoId: 'acceso-roles-permisos'
  },
  {
    label: 'Cerrar sesión',
    icon: 'mdi mdi-logout',
    redirectTo: PAGE_LOG_OUT
  }
];

const ProfileDropdown = () => {
  const [isOpen, toggleDropdown] = useToggle();
  const user = useAppSelector(selectUser);

  const title: string = useMemo(() => {
    return getNombreCompletoUser(user);
  }, [user]);

  const userImg: string = useMemo(() => {
    if (user.userImage && user.userImage !== '') return user.userImage;
    else return fallBackLogo;
  }, [user.userImage]);

  const profileMenuOptions = useMemo(() => {
    const newProfileMenu = profileMenus.filter((menu) => {
      if (!menu.permisoId) return true;
      return user.roles.some((rol) =>
        rol.permisos?.some((permiso) => permiso.permiso === menu.permisoId)
      );
    });
    return newProfileMenu;
  }, [user.roles]);

  return (
    <Dropdown show={isOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        variant="link"
        id="dropdown-profile"
        as={'button'}
        onClick={toggleDropdown}
        className="nav-link dropdown-toggle arrow-none nav-user px-2">
        <span className="account-user-avatar">
          <img
            src={userImg}
            className="rounded-circle object-fit-cover"
            style={{aspectRatio: '1/1'}}
            width={32}
            height={32}
            alt="user"
            loading="lazy"
          />
        </span>
        <span className="d-lg-flex flex-column gap-1 d-none">
          <h5 className="my-0 align-self-start">{title}</h5>
          <h6 className="my-0 fw-normal align-self-start">{user.email}</h6>
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu align={'end'} className="dropdown-menu-animated profile-dropdown">
        <div onClick={toggleDropdown}>
          <div className="dropdown-header noti-title">
            <h6 className="text-overflow m-0">Bienvenido!</h6>
          </div>
          {(profileMenuOptions || []).map((item, i) => {
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
