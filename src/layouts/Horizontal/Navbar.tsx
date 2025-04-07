import {MenuItemType, NavbarProps} from '@/types';
import AppMenu from '@/layouts/Horizontal/Menu';
import {Collapse, Container} from 'react-bootstrap';
import {memo, useMemo} from 'react';
import {useAppSelector} from '@/store';
import {selectClientes, selectUser} from '@/store/selectores';
import {navBarFilterByPermissions} from '@/utils';
import {HORIZONTAL_MENU_ITEMS} from '@/common';
import {CLIENTES_MENU_KEY} from '@/constants';

const Navbar = ({isMenuOpened}: NavbarProps) => {
  const user = useAppSelector(selectUser);
  const clientes = useAppSelector(selectClientes);

  const menuItems: MenuItemType[] = useMemo(() => {
    return HORIZONTAL_MENU_ITEMS.map((menuItem) => {
      return menuItem.key === CLIENTES_MENU_KEY
        ? {
            ...menuItem,
            children: clientes.map<MenuItemType>((cliente) => {
              return {
                key: `${CLIENTES_MENU_KEY}/${cliente.domain}`,
                label: cliente.nombre.toLowerCase(),
                parentKey: CLIENTES_MENU_KEY,
                url: `${CLIENTES_MENU_KEY}/${cliente.domain}`
              };
            })
          }
        : {...menuItem};
    });
  }, [clientes]);

  const menuItemsFiltered: MenuItemType[] = useMemo(() => {
    return navBarFilterByPermissions(menuItems, user.roles, user.permisosOtorgados, user.permisosDenegados);
  }, [menuItems, user.permisosDenegados, user.permisosOtorgados, user.roles]);

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
