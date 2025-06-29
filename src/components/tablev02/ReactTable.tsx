import type {ReactTableProps} from '@/types/component-props';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TableType,
  Row,
  type ExpandedState,
  type PaginationState
} from '@tanstack/react-table';
import classNames from 'classnames';
import {Fragment, memo, ReactElement, useEffect, useMemo, useRef, useState, type HTMLProps} from 'react';
import {Form, Table} from 'react-bootstrap';
import Pagination from './Pagination';
import {useDispatch} from 'react-redux';
import {setSelectedRows} from '@/store/slices/selected-row';
import {SelectedRowType} from '@/types';

const IndeterminateCheckbox = memo(function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: {indeterminate?: boolean} & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    if (typeof indeterminate === 'boolean') ref.current.indeterminate = !rest.checked && indeterminate;
  }, [ref, indeterminate, rest.checked]);
  return (
    <div className="form-check p-0 m-0 w-100 d-flex justify-content-center">
      <input type="checkbox" className="form-check-input cursor-pointer ms-0 mx-0 p-0" ref={ref} {...rest} />
      <label htmlFor="form-check-input" className="form-check-label d-none"></label>
    </div>
  );
});

const ReactTable = <RowType,>({
  columns,
  data,
  pageSize,
  showPagination,
  tableClass,
  isSearchable,
  searchBoxClass,
  theadClass,
  isSelectable,
  renderSubComponent,
  getRowCanExpand
}: ReactTableProps<RowType>) => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize ?? 10
  });

  const [globalFilter, setGlobalFilter] = useState<any>([]);

  const [rowSelection, setRowSelection] = useState({});

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 34,
      maxSize: 600
    },
    getRowId: (row, i) => (row as any)?.id ?? i,
    getSubRows: (row) => (row as any)?.subRows || [],
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    state: {pagination, globalFilter, rowSelection, expanded},
    initialState: {globalFilter: ''},
    enableRowSelection: true,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(showPagination && {getPaginationRowModel: getPaginationRowModel()}),
    ...(getRowCanExpand && {getRowCanExpand})
  });

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: {[key: string]: number} = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  useEffect(() => {
    if (!isSelectable) return;
    if (table.getSelectedRowModel().rows) {
      const selectedRows: RowType[] = table.getSelectedRowModel().rows.map((row) => row.original);
      dispatch(setSelectedRows(selectedRows as SelectedRowType[]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isSelectable, table.getSelectedRowModel().rows.length]);

  return (
    <>
      {isSearchable && (
        <div className={classNames('app-search', searchBoxClass)}>
          <Form>
            <Form.Group className="mb-1 w-100 position-relative">
              <Form.Control
                type="text"
                placeholder={`${table.getRowCount()} registros...`}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
              />
              <span className="mdi mdi-magnify search-icon"></span>
            </Form.Group>
          </Form>
        </div>
      )}
      <Table
        responsive
        className={classNames('table table-centered dt-responsive nowrap dataTable no-footer dtr-inline', tableClass)}
        id="datatable"
        style={{
          ...columnSizeVars,
          width: `${table.getTotalSize()}px`,
          minWidth: '100%',
          tableLayout: 'fixed'
        }}>
        <thead className={theadClass}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{width: 'fit-content'}}>
              {isSelectable && (
                <th className="p-0 m-0" style={{width: '34px', minWidth: '34px', maxWidth: '34px'}}>
                  <IndeterminateCheckbox
                    {...{
                      checked: table.getIsAllRowsSelected(),
                      indeterminate: table.getIsSomeRowsSelected(),
                      onChange: table.getToggleAllRowsSelectedHandler()
                    }}
                  />
                </th>
              )}
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="position-relative"
                  style={{width: `calc(var(--header-${header?.id}-size) * 1px)`}}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanResize() && (
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`
                      }}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {table.getState().columnSizingInfo.isResizingColumn ? (
          <MemoizedTableBody table={table} isSelectable={isSelectable} renderSubComponent={renderSubComponent} />
        ) : (
          <TableBody table={table} isSelectable={isSelectable} renderSubComponent={renderSubComponent} />
        )}
      </Table>
      {showPagination && (
        <Pagination
          table={table}
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          pagination={pagination}
        />
      )}
    </>
  );
};

function TableBody<T>({
  table,
  isSelectable = false,
  renderSubComponent
}: {
  table: TableType<T>;
  isSelectable?: boolean;
  renderSubComponent?: (props: {row: Row<T>}) => ReactElement;
}) {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <Fragment key={row.id}>
          <tr className={row.depth > 0 ? 'isSubRegister' : ''} style={{width: 'fit-content'}}>
            {isSelectable && (
              <td className="p-0 m-0" style={{width: '34px', minWidth: '34px', maxWidth: '34px'}}>
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler()
                  }}
                />
              </td>
            )}
            {row.getVisibleCells().map((cell) => (
              <td style={{width: `calc(var(--col-${cell.column.id}-size) * 1px)`}} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
          {row.getIsExpanded() && renderSubComponent ? (
            <tr className="m-0 p-0" style={{width: 'fit-content'}}>
              <td className="m-0 p-0" colSpan={row.getVisibleCells().length}>
                {renderSubComponent({row})}
              </td>
            </tr>
          ) : null}
        </Fragment>
      ))}
    </tbody>
  );
}

export const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof TableBody;

export default ReactTable;
