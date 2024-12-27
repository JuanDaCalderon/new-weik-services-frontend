import {thisUsuarios} from '@/types';
import {getNombreCompletoUser, getRolesUser} from '@/utils';
import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from 'react-bootstrap';

const usuariosColumns: ColumnDef<thisUsuarios>[] = [
  {
    header: 'Usuario',
    accessorKey: 'usuario',
    meta: {columnId: 'usuario'},
    cell: ({row}) => {
      return (
        <div
          className="d-flex align-items-center cursor-pointer no-user-text-selectable scale-hover"
          onClick={row.getToggleExpandedHandler()}>
          <img src={row.original.userImage} className="rounded-circle avatar-xs" alt="friend" />
          <div className="ms-1 d-flex flex-column">
            <span className="m-0 lh-sm fw-bold text-uppercase text-dark text-opacity-75 d-inline">
              {getNombreCompletoUser(row.original)}
            </span>
            <span className="m-0 lh-sm d-inline">{row.original.email}</span>
          </div>
        </div>
      );
    }
  },
  {
    header: 'Cargo',
    accessorKey: 'cargo'
  },
  {
    header: 'Roles',
    accessorKey: 'roles',
    meta: {columnId: 'roles'},
    cell: ({row}) => {
      return (
        <>
          <Badge bg="" className="badge-outline-danger">
            {getRolesUser(row.original)}
          </Badge>
          <br />
          <Badge bg="" className="badge-outline-danger">
            {getRolesUser(row.original)}
          </Badge>
          <br />
        </>
      );
    }
  },
  {
    header: 'Permisos Otorgados',
    accessorKey: 'permisosOtorgados'
  },
  {
    header: 'Permisos Denegados',
    accessorKey: 'permisosDenegados'
  }
];

export {usuariosColumns};
