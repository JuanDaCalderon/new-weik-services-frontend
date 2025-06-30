import React, {useEffect, useState, useCallback, memo, useMemo, JSX} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {AppMenuProps, MenuItems, MenuItemType} from '@/types';
import classNames from 'classnames';
import {findAllParent, findMenuItem} from '@/layouts/utils/menu';
import {CLIENTES_ROUTER_PATH, REGISTRO_STATUS} from '@/constants';
import {useAppSelector} from '@/store';
import {selectRegistros} from '@/store/selectores';

const MenuItemWithChildren = memo(function MenuItemWithChildren({
  item,
  tag,
  linkClassName,
  className,
  subMenuClassNames,
  activeMenuItems,
  toggleMenu
}: MenuItems) {
  const Tag: React.ElementType = tag || 'div';

  const [open, setOpen] = useState<boolean>(activeMenuItems!.includes(item.key));

  const showMenu = window.screen.width <= 991 && open;

  useEffect(() => {
    setOpen(activeMenuItems!.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const status = !open;
      setOpen(status);
      if (toggleMenu) toggleMenu(item, status);
      return false;
    },
    [item, open, toggleMenu]
  );

  return (
    <Tag className={classNames('dropdown', className, activeMenuItems!.includes(item.key) ? 'active' : '')}>
      <Link
        to=""
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        data-url-match={item.url}
        className={classNames('dropdown-toggle', 'arrow-none', linkClassName)}
        id={item.key}
        role="button"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded={open}>
        {item.icon && <i className={item.icon}></i>}
        <span> {item.label} </span>
        <div className="arrow-down"></div>
      </Link>

      {item.children && (
        <div className={classNames(subMenuClassNames, {show: showMenu})} aria-labelledby={item.key}>
          {item.children.map((child, index) => {
            return (
              <React.Fragment key={index.toString()}>
                {child.children ? (
                  <>
                    {/* parent */}
                    <MenuItemWithChildren
                      item={child}
                      tag="div"
                      linkClassName={classNames('dropdown-item', activeMenuItems!.includes(child.key) ? 'active' : '')}
                      activeMenuItems={activeMenuItems}
                      className=""
                      subMenuClassNames={classNames('dropdown-menu')}
                      toggleMenu={toggleMenu}
                    />
                  </>
                ) : (
                  <>
                    {/* child */}
                    <MenuItemLink
                      item={child}
                      className={classNames('dropdown-item', {
                        active: activeMenuItems!.includes(child.key)
                      })}
                    />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </Tag>
  );
});

const MenuItem = memo(function MenuItem({item, className, linkClassName}: MenuItems) {
  return (
    <li className={`nav-item ${className}`}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
});

const MenuItemLink = memo(function MenuItemLink({item, className}: MenuItems) {
  const registros = useAppSelector(selectRegistros);

  const pendingRegisters: JSX.Element = useMemo(() => {
    if (item.parentKey === CLIENTES_ROUTER_PATH) {
      const data = registros?.[item.key.split('/').at(-1) || ''] || {};
      let totalRegistros = 0;
      for (const tipo in data) {
        const registros = data[tipo]?.registros ?? [];
        const registrosValidos = registros.filter((registro) => registro.estado !== REGISTRO_STATUS.ENTREGADO);
        totalRegistros += registrosValidos.length;
      }
      if (totalRegistros === 0) return <i className="mdi mdi-check-circle text-success" />;
      else return <span className="mb-1 badge rounded-pill bg-danger text-center">{totalRegistros}</span>;
    } else return <></>;
  }, [item.key, item.parentKey, registros]);

  return (
    <Link to={item.url!} target={item.target} className={className} data-menu-key={item.key} data-url-match={item.url}>
      {item.icon && <i className={item.icon}></i>}
      <span> {item.label} </span>
      {pendingRegisters}
    </Link>
  );
});

const AppMenu = ({menuItems}: AppMenuProps) => {
  const [activeMenuItems, setActiveMenuItems] = useState<string[]>([]);

  const location = useLocation();

  /* toggle the menus */
  const toggleMenu = (menuItem: MenuItemType, show: boolean) => {
    if (show) setActiveMenuItems([menuItem.key, ...findAllParent(menuItems, menuItem)]);
  };

  /** activate the menuitems */
  const activeMenu = useCallback(() => {
    const div = document.getElementById('main-side-menu');
    let matchingMenuItem = null;
    if (div) {
      const items: HTMLAnchorElement[] = Array.from(div.getElementsByTagName('a')).filter((anchor) =>
        anchor.hasAttribute('data-url-match')
      );
      for (let i = 0; i < items.length; ++i) {
        const urlMatch = items[i].getAttribute('data-url-match') || '';
        if (location.pathname === urlMatch) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('data-menu-key');
        const activeMt = findMenuItem(menuItems, mid!);
        if (activeMt) setActiveMenuItems([...new Set([activeMt['key'], ...findAllParent(menuItems, activeMt)])]);
      } else setActiveMenuItems([]);
    }
  }, [location.pathname, menuItems]);

  useEffect(() => {
    if (menuItems && menuItems.length > 0) activeMenu();
  }, [activeMenu, menuItems]);

  return (
    <ul className="navbar-nav w-100" id="main-side-menu">
      {(menuItems || []).map((item, index) => {
        return (
          <React.Fragment key={index.toString()}>
            {item.children ? (
              <MenuItemWithChildren
                item={item}
                tag="li"
                className="nav-item"
                subMenuClassNames={classNames('dropdown-menu')}
                activeMenuItems={activeMenuItems}
                linkClassName="nav-link"
                toggleMenu={toggleMenu}
              />
            ) : (
              <MenuItem
                item={item}
                linkClassName="nav-link dropdown-toggle arrow-none"
                className={activeMenuItems.includes(item.key) ? 'show' : ''}
              />
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default memo(AppMenu);
