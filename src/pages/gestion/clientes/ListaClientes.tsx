import {memo, useEffect} from 'react';
import ReactTable from '@/components/table/ReactTable';
import {Cliente} from '@/types';
import {columns} from './Columnas';
import {useAppSelector} from '@/store';
import {isLoadingClientes, selectClientes} from '@/store/selectores';
import {useGetClients} from '@/endpoints';
import {SkeletonLoader} from '@/components/SkeletonLoader';

const ListaClientes = memo(function ListaClientes() {
  const clientes = useAppSelector(selectClientes);
  const isLoadingClients = useAppSelector(isLoadingClientes);
  const {getClientesSync} = useGetClients();

  useEffect(() => {
    if (clientes.length <= 0) getClientesSync();
  }, [clientes.length, getClientesSync]);

  return (
    <>
      <h4 className="header-title text-dark text-opacity-75 m-0 ms-1">Clientes</h4>
      {isLoadingClients ? (
        <SkeletonLoader height="500px" customClass="p-0 mt-2" />
      ) : (
        <ReactTable<Cliente>
          columns={columns}
          data={clientes}
          pageSize={10}
          tableClass="table-striped"
          showPagination
        />
      )}
    </>
  );
});

export {ListaClientes};
