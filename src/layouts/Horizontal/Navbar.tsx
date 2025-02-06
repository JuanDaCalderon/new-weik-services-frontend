import {MenuItemType, NavbarProps} from '@/types';
import {getHorizontalMenuItems} from '@/layouts/utils/menu';
import AppMenu from '@/layouts/Horizontal/Menu';
import {Collapse, Container} from 'react-bootstrap';
import {memo, useMemo} from 'react';
import {useAppSelector} from '@/store';
import {selectUser} from '@/store/selectores';
import {navBarFilterByPermissions} from '@/utils';

const Navbar = ({isMenuOpened}: NavbarProps) => {
  const user = useAppSelector(selectUser);

  const menuItemsFiltered: MenuItemType[] = useMemo(() => {
    return navBarFilterByPermissions(
      getHorizontalMenuItems(),
      user.roles,
      user.permisosOtorgados,
      user.permisosDenegados
    );
  }, [user.permisosDenegados, user.permisosOtorgados, user.roles]);

  return (
    <div className="topnav">
      <Container fluid>
        <nav className="navbar navbar-expand-lg">
          <Collapse in={isMenuOpened}>
            <div className="navbar-collapse active">
              <AppMenu menuItems={menuItemsFiltered} />
            </div>
          </Collapse>
        </nav>
      </Container>
    </div>
  );
};

export default memo(Navbar);
