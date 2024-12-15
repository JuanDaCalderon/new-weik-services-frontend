import type {ReactTablePaginationProps} from '@/types/component-props';
import classNames from 'classnames';
import {Fragment, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

const getVisiblePages = (totalPages: number, currentPage: number): number[] => {
  if (totalPages > 1) {
    if (currentPage === 1) {
      return [currentPage, currentPage + 1, currentPage + 2].filter(
        (page) => page > 0 && page <= totalPages
      );
    } else if (currentPage === totalPages) {
      return [currentPage - 2, currentPage - 1, currentPage].filter(
        (page) => page > 0 && page <= totalPages
      );
    } else {
      return [currentPage - 1, currentPage, currentPage + 1].filter(
        (page) => page > 0 && page <= totalPages
      );
    }
  }
  return [1];
};

const Pagination = <RowType,>({
  table,
  currentPage,
  totalPages
}: ReactTablePaginationProps<RowType>) => {
  const [visiblePages, setVisiblePages] = useState<number[]>([1]);
  const pageSizeList = [10, 25, 50, 100];

  useEffect(() => {
    setVisiblePages(getVisiblePages(totalPages, currentPage));
  }, [currentPage, totalPages]);

  return (
    <div className="d-lg-flex align-items-center text-center">
      {pageSizeList.length > 0 && (
        <div className="d-inline-flex gap-2 align-items-center">
          <label className="me-1">Mostrar </label>
          <select
            name="page-size-select"
            id="page-size-select"
            className="form-select form-select-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}>
            {pageSizeList.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      )}
      <span className="mx-3">
        Página&nbsp;
        {currentPage} de {totalPages}
      </span>

      <ul className="pagination pagination-rounded d-inline-flex ms-auto align-item-center mb-0">
        <li
          key="prevpage"
          className={classNames('page-item', 'paginate_button', 'previous', {
            disabled: !table.getCanPreviousPage()
          })}
          onClick={() => table.previousPage()}>
          <button className="page-link">
            <i className="mdi mdi-chevron-left"></i>
          </button>
        </li>
        {(visiblePages || []).map((page, index, array) => {
          return array[index - 1] + 1 < page ? (
            <Fragment key={page.toString()}>
              <li className="page-item disabled d-none d-xl-inline-block">
                <Link to="" className="page-link">
                  ...
                </Link>
              </li>
              <li
                className={classNames('page-item', 'd-none', 'd-xl-inline-block', {
                  active: page === currentPage
                })}
                onClick={() => table.setPageIndex(page - 1)}>
                <button className="page-link">{page}</button>
              </li>
            </Fragment>
          ) : (
            <li
              key={page.toString()}
              className={classNames('page-item', 'd-none', 'd-xl-inline-block', {
                active: page === currentPage
              })}
              onClick={() => table.setPageIndex(page - 1)}>
              <button className="page-link">{page}</button>
            </li>
          );
        })}
        <li
          key="nextpage"
          className={classNames('page-item', 'paginate_button', 'next', {
            disabled: !table.getCanNextPage()
          })}
          onClick={() => table.nextPage()}>
          <button className="page-link">
            <i className="mdi mdi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
