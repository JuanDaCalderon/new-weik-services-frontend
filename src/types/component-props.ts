import type {ColumnDef, PaginationState, Table, TableOptions} from '@tanstack/react-table';
import type {ChangeEvent, ReactNode} from 'react';
import {MenuItemType} from './menu';

export type ChildrenType = Readonly<{children: ReactNode}>;

export type ReactTableProps<RowType> = {
  options?: TableOptions<RowType>;
  columns: ColumnDef<RowType>[];
  data: RowType[];
  showPagination?: boolean;
  rowsPerPageList?: number[];
  isSearchable?: boolean;
  isSelectable?: boolean;
  isExpandable?: boolean;
  pageSize?: number;
  tableClass?: string;
  theadClass?: string;
  searchBoxClass?: string;
};

export type ReactTablePaginationProps<RowType> = {
  table: Table<RowType>;
  rowsPerPageList?: number[];
  currentPage: number;
  totalPages: number;
  pagination: PaginationState;
};

export interface SkeletonLoaderProps {
  customClass?: string;
  width?: string;
  height?: string;
}

export type TopbarProps = {
  toggleMenu?: () => void;
  navOpen?: boolean;
};

export type NavbarProps = {
  isMenuOpened?: boolean;
};

export type AppMenuProps = {
  menuItems: Array<MenuItemType>;
};

export interface DisplayInfoProps {
  label: string;
  value?: string;
  className?: string;
}

export interface LabelWithControlProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
