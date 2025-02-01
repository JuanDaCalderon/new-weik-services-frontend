import {Cliente} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useCallback, useMemo, JSX} from 'react';
import {Button} from 'react-bootstrap';
import {useToggle} from '@/hooks';
import {useDeleteClient, useGetClients} from '@/endpoints';

const clientesAcciones = memo(function RolNameColumn({row}: {row: Row<Cliente>}) {
  const [deleteClienteOpen, deleteClienteToggle, showDeleteCliente, hideDeleteCliente] =
    useToggle();
  const {isLoadingDeleteCliente, deleteCliente} = useDeleteClient();
  const {getClientesSync} = useGetClients();

  const onDeleteClient = useCallback(async () => {
    await deleteCliente(row.original.id);
    await getClientesSync();
    hideDeleteCliente();
  }, [deleteCliente, getClientesSync, hideDeleteCliente, row.original.id]);

  const deleteModalBody: JSX.Element = useMemo(
    () => (
      <div className="d-flex w-100 justify-content-around align-items-center gap-1">
        <img
          src={row.original.logo}
          alt={row.original.logo}
          loading="lazy"
          width={100}
          height={100}
          className="img rounded-circle object-fit-contain d-block"
        />
        <p className="d-block p-0 m-0">
          Esta seguro que quiere eliminar el cliente con el nombre: <b>{row.original.nombre}</b>
        </p>
      </div>
    ),
    [row.original.logo, row.original.nombre]
  );

  return (
    <>
      <div className="d-flex gap-1">
        <Button type="button" variant="outline-primary py-0 px-1">
          <i className="uil-pen"></i>
        </Button>
        <Button type="button" variant="outline-danger py-0 px-1" onClick={showDeleteCliente}>
          <i className="uil-trash"></i>
        </Button>
      </div>
      <GenericModal
        show={deleteClienteOpen}
        onToggle={deleteClienteToggle}
        variant="danger"
        headerText={`Eliminar cliente ${row.original.domain}`}
        submitText="Eliminar"
        secondaryText="Cancelar"
        body={deleteModalBody}
        isDisabled={isLoadingDeleteCliente}
        isLoading={isLoadingDeleteCliente}
        onSend={onDeleteClient}></GenericModal>
    </>
  );
});

const columns: ColumnDef<Cliente>[] = [
  {
    header: 'Cliente',
    accessorKey: 'nombre',
    cell: ({row}) => (
      <div className="table-user">
        <img
          src={row.original.logo}
          alt={row.original.logo}
          loading="lazy"
          className="me-2 rounded-circle object-fit-contain"
        />
        <span className="fw-bold text-dark text-opacity-75">{row.original.nombre}</span>
      </div>
    )
  },
  {
    header: 'Dominio',
    accessorKey: 'domain'
  },
  {
    header: 'Link de branding',
    accessorKey: 'branding',
    cell: ({row}) => (
      <a
        className="link-opacity-100-hover"
        href={row.original.branding}
        target="_blank"
        rel="noreferrer">
        Ir al link
      </a>
    )
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: clientesAcciones
  }
];

export {columns};
