import {memo, useEffect} from 'react';
import ReactTable from '@/components/table/ReactTable';
import {Employee} from '@/types';
import {columns} from './Columnas';
import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees} from '@/store/selectores';
import {useGetEmployees} from '@/endpoints';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const ListaUsuarios = memo(function ListaUsuarios() {
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {getEmployeesSync} = useGetEmployees();

  useEffect(() => {
    if (users.length <= 0) getEmployeesSync();
  }, [getEmployeesSync, users.length]);

  return (
    <>
      <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Usuarios</h4>
      {isLoadingUsers ? (
        <SkeletonLoader height="500px" customClass="p-0 mt-2" />
      ) : (
        <ReactTable<Employee> columns={columns} data={users} pageSize={10} tableClass="table-striped" showPagination />
      )}
    </>
  );
});

export {ListaUsuarios};
