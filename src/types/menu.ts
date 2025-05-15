import {ElementType} from 'react';

export type MenuItemType = {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  badge?: {
    variant: string;
    text: string;
  };
  parentKey?: string;
  target?: string;
  children?: MenuItemType[];
  permisoId?: string;
};

export type MenuItems = {
  item: MenuItemType;
  tag?: ElementType;
  linkClassName?: string;
  className?: string;
  subMenuClassNames?: string;
  activeMenuItems?: string[];
  toggleMenu?: (item: MenuItemType, status: boolean) => void;
};

export type MenuItem = {
  permisoId?: string;
  [key: string]: any;
};
