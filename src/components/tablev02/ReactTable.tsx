import type {ReactTableProps} from '@/types/component-props';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ExpandedState,
  type PaginationState
} from '@tanstack/react-table';
import classNames from 'classnames';
import {Fragment, useEffect, useRef, useState, type HTMLProps} from 'react';
import {Form, Table} from 'react-bootstrap';
import Pagination from './Pagination';

const IndeterminateCheckbox = ({indeterminate, ...rest}: {indeterminate?: boolean} & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <div className="form-check">
      <input type="checkbox" className="form-check-input cursor-pointer" ref={ref} {...rest} />
      <label htmlFor="form-check-input" className="form-check-label"></label>
    </div>
  );
};

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

  return (
    <>
      {isSearchable && (
        <div className={classNames('app-search', searchBoxClass)}>
          <Form>
            <Form.Group className="mb-2 w-100 position-relative">
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
        className={classNames(
          'table table-centered w-100 dt-responsive nowrap dataTable no-footer dtr-inline',
          tableClass
        )}
        id="datatable"
        aria-describedby="datatable_info"
        style={{width: 1552}}>
        <thead className={theadClass}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {isSelectable && (
                <th>
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
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr>
                {isSelectable && (
                  <td>
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
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
              {row.getIsExpanded() && renderSubComponent ? (
                <tr className="m-0 p-0">
                  <td className="m-0 p-0" colSpan={row.getVisibleCells().length}>
                    {renderSubComponent({row})}
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
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

export default ReactTable;
