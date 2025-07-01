import type {ColumnDef, PaginationState, Row, Table} from '@tanstack/react-table';
import type {ChangeEvent, ReactElement, ReactNode} from 'react';
import {MenuItemType} from '@/types';

export type ChildrenType = Readonly<{children: ReactNode}>;

export type ReactTableProps<RowType> = {
  columns: ColumnDef<RowType>[];
  data: RowType[];
  showPagination?: boolean;
  isSearchable?: boolean;
  isSelectable?: boolean;
  isExpandable?: boolean;
  pageSize?: number;
  tableClass?: string;
  theadClass?: string;
  searchBoxClass?: string;
  shouldStartExpanded?: boolean;
  renderSubComponent?: (props: {row: Row<RowType>}) => ReactElement;
  getRowCanExpand?: (row: Row<RowType>) => boolean;
};

export type ReactTablePaginationProps<RowType> = {
  table: Table<RowType>;
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
