import {Employee} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {GenericModal} from '@/components/Modals/GenericModal';
import {memo, useCallback} from 'react';
import {Button} from 'react-bootstrap';
import {useToggle} from '@/hooks';

const UsuariosAcciones = memo(function RolNameColumn({row}: {row: Row<Employee>}) {
  const [editClienteOpen, editClienteToggle, showEditCliente] = useToggle();
  const [deleteClienteOpen, deleteClienteToggle, showDeleteCliente] = useToggle();

  const onDeleteUser = useCallback(async () => {
    console.log('delete user');
  }, []);

  const onEditUser = useCallback(async () => {
    console.log('edit client');
  }, []);

  return (
    <>
      <div className="d-flex gap-1">
        <Button variant="outline-primary py-0 px-1" onClick={showEditCliente}>
          <i className="uil-pen"></i>
        </Button>
        <Button variant="outline-danger py-0 px-1" onClick={showDeleteCliente}>
          <i className="uil-trash"></i>
        </Button>
      </div>
      <GenericModal
        show={deleteClienteOpen}
        onToggle={deleteClienteToggle}
        variant="danger"
        headerText={`Eliminar usuario ${row.original.email}`}
        submitText="Eliminar"
        secondaryText="Cancelar"
        body={<span>delete</span>}
        onSend={onDeleteUser}
      />
      <GenericModal
        show={editClienteOpen}
        onToggle={editClienteToggle}
        variant="info"
        headerText={`Editar usuario ${row.original.email}`}
        submitText="Editar"
        secondaryText="Cancelar"
        body={<span>edit</span>}
        onSend={onEditUser}
      />
    </>
  );
});

const columns: ColumnDef<Employee>[] = [
  {
    header: 'Usuario',
    accessorKey: 'email',
    cell: ({row}) => (
      <div className="table-user">
        <img
          src={row.original.userImage}
          alt={row.original.userImage}
          loading="lazy"
          className="me-2 rounded-circle object-fit-contain"
        />
        <span className="fw-bold text-dark text-opacity-75">{row.original.email}</span>
      </div>
    )
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: UsuariosAcciones
  }
];

export {columns};
