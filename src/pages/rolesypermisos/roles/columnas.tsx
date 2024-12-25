import {thisRol} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from 'react-bootstrap';
import {DateUtils} from '@/utils';

const rolesColumns: ColumnDef<thisRol>[] = [
  {
    header: 'Rol',
    accessorKey: 'rolName',
    cell: ({row}) => (
      <div
        className="ribbon-box cursor-pointer no-user-text-selectable scale-hover"
        onClick={row.getToggleExpandedHandler()}>
        {DateUtils.isToday(row.original.ribbonCreatedDate) && (
          <div
            className={`ribbon-two ribbon-two-success end-0`}
            style={{left: '84%', top: '-11px'}}>
            <span className="font-12">Nuevo Rol</span>
          </div>
        )}
        <div className=" d-flex justify-content-start align-content-center align-items-center">
          <span className="d-block mb-1" style={{width: '20px', height: '20px'}}>
            {row.getIsExpanded() ? '👇' : '👉'}
          </span>
          <span className="d-block no-user-text-selectable fw-bold text-uppercase text-dark text-opacity-75">
            {row.original.rolName}
          </span>
        </div>
        <span className="d-inline-block" style={{maxWidth: '400px'}}>
          {row.original.descripcion || row.original.rolName}
        </span>
      </div>
    )
  },
  {
    header: 'Creado por',
    accessorKey: 'createdBy'
  },
  {
    header: 'Creado en',
    accessorKey: 'createdDate'
  },
  {
    header: 'Actualizado por',
    accessorKey: 'updatedBy'
  },
  {
    header: 'Actualizado en',
    accessorKey: 'updatedDate'
  },
  {
    header: 'Permisos del rol',
    accessorKey: 'RolePermisos',
    cell: ({row}) => (
      <Badge bg="" pill className="me-1 badge-outline-info font-14">
        {row.original.RolePermisos}
      </Badge>
    )
  },
  {
    header: 'Usuarios del rol',
    accessorKey: 'RoleUsuarios',
    cell: ({row}) => (
      <Badge bg="" pill className="me-1 badge-outline-warning font-14">
        {row.original.RoleUsuarios}
      </Badge>
    )
  }
];

export {rolesColumns};
