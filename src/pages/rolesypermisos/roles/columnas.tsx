import {thisRol} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from 'react-bootstrap';
import {DateUtils} from '@/utils';
import type {Row} from '@tanstack/react-table';
import {useRolesUsuariosContext} from '@/pages/rolesypermisos/context';
import {memo, useCallback, useMemo} from 'react';
import {ROLES_CELLS} from '@/constants';

const RolNameColumn = memo(function RolNameColumn({row}: {row: Row<thisRol>}) {
  const {updateRolesCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.rolesCell !== ROLES_CELLS.rol) toggleHandler();
    updateRolesCell(ROLES_CELLS.rol);
    toggleHandler();
  }, [rolesUsuarios.rolesCell, row, updateRolesCell]);

  return (
    <div className="ribbon-box no-user-text-selectable">
      {DateUtils.isToday(row.original.ribbonCreatedDate) ? (
        <div className="ribbon-two ribbon-two-success end-0" style={{left: '84%', top: '-11px'}}>
          <span className="font-12">Nuevo Rol</span>
        </div>
      ) : (
        DateUtils.isToday(row.original.ribbonUpdatedDate) && (
          <div className={`ribbon-two ribbon-two-info end-0`} style={{left: '84%', top: '-10px'}}>
            <span className="font-12">Actualizado</span>
          </div>
        )
      )}
      <div className="cursor-pointer scale-hover" onClick={onClickHandled}>
        <div className=" d-flex justify-content-start align-content-center align-items-center">
          <span className="d-block mb-1" style={{width: '20px', height: '20px'}}>
            {row.getIsExpanded() && rolesUsuarios.rolesCell === ROLES_CELLS.rol ? '👇' : '👉'}
          </span>
          <span className="d-block no-user-text-selectable fw-bold text-uppercase text-dark text-opacity-75">
            {row.original.rolName}
          </span>
        </div>
        <span className="d-inline-block" style={{maxWidth: '400px'}}>
          {row.original.descripcion || row.original.rolName}
        </span>
      </div>
    </div>
  );
});

const RolePermisosColumn = memo(function RolePermisosColumn({row}: {row: Row<thisRol>}) {
  const {updateRolesCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.rolesCell !== ROLES_CELLS.permisos) toggleHandler();
    updateRolesCell(ROLES_CELLS.permisos);
    toggleHandler();
  }, [rolesUsuarios.rolesCell, row, updateRolesCell]);

  return (
    <div
      className="ribbon-box cursor-pointer no-user-text-selectable scale-hover"
      onClick={onClickHandled}>
      <span className="me-1" style={{width: '20px', height: '20px'}}>
        {row.getIsExpanded() && rolesUsuarios.rolesCell === ROLES_CELLS.permisos ? '👇' : '👉'}
      </span>
      <Badge bg="" pill className="me-1 badge-outline-info font-14">
        {row.original.RolePermisos}
      </Badge>
    </div>
  );
});

const RoleUsuariosColumn = memo(function RoleUsuariosColumn({row}: {row: Row<thisRol>}) {
  const {updateRolesCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    if (row.original.RoleUsuarios) {
      const toggleHandler = row.getToggleExpandedHandler();
      if (row.getIsExpanded() && rolesUsuarios.rolesCell !== ROLES_CELLS.usuarios) toggleHandler();
      updateRolesCell(ROLES_CELLS.usuarios);
      toggleHandler();
    }
  }, [rolesUsuarios.rolesCell, row, updateRolesCell]);

  const roleUsuarios: string = useMemo(() => {
    return row.original.RoleUsuarios ? row.original.RoleUsuarios : 'cargando';
  }, [row.original.RoleUsuarios]);

  const getfeedbackIcon = (): string => {
    if (row.getIsExpanded() && rolesUsuarios.rolesCell === ROLES_CELLS.usuarios) return '👇';
    else return row.original.RoleUsuarios ? '👉' : '⏳';
  };

  return (
    <div
      className={`ribbon-box no-user-text-selectable ${row.original.RoleUsuarios && 'cursor-pointer scale-hover'}`}
      style={{transformOrigin: 'center'}}
      onClick={onClickHandled}>
      <span className="me-1" style={{width: '20px', height: '20px'}}>
        {getfeedbackIcon()}
      </span>
      <Badge bg="" pill className="me-1 badge-outline-warning font-14">
        {roleUsuarios}
      </Badge>
    </div>
  );
});

const rolesColumns: ColumnDef<thisRol>[] = [
  {
    header: 'Rol',
    accessorKey: 'rolName',
    cell: RolNameColumn
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
    cell: RolePermisosColumn
  },
  {
    header: 'Usuarios del rol',
    accessorKey: 'RoleUsuarios',
    cell: RoleUsuariosColumn
  }
];

export {rolesColumns};
