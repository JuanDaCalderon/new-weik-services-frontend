import {thisUsuarios} from '@/types';
import {getNombreCompletoUser} from '@/utils';
import {type ColumnDef, type Row} from '@tanstack/react-table';
import {memo, useCallback, useMemo} from 'react';
import {Badge} from 'react-bootstrap';
import {useRolesUsuariosContext} from '../context';
import {USUARIOS_CELLS} from '@/constants';
import fallBackLogo from '@/assets/images/logo-fallback.png';

const UsuariosColumn = memo(function UsuariosColumn({row}: {row: Row<thisUsuarios>}) {
  const {updateUsuariosCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.usuariosCell !== USUARIOS_CELLS.cargo) toggleHandler();
    updateUsuariosCell(USUARIOS_CELLS.cargo);
    toggleHandler();
  }, [rolesUsuarios.usuariosCell, row, updateUsuariosCell]);

  return (
    <div
      className={`d-flex align-items-center no-user-text-selectable ${row.getCanExpand() && 'cursor-pointer scale-hover'}`}
      onClick={onClickHandled}>
      {row.getCanExpand() && (
        <span className="me-1" style={{width: '20px', height: '20px'}}>
          {row.getIsExpanded() && rolesUsuarios.usuariosCell === USUARIOS_CELLS.cargo ? '👇' : '👉'}
        </span>
      )}
      <img
        src={row.original.userImage && row.original.userImage !== '' ? row.original.userImage : fallBackLogo}
        alt={row.original.userImage && row.original.userImage !== '' ? row.original.userImage : 'user'}
        className="rounded-circle avatar-xs"
      />
      <div className="ms-1 d-flex flex-column">
        <span className="m-0 lh-sm fw-bold text-uppercase text-dark text-opacity-75 d-inline">
          {getNombreCompletoUser(row.original)}
        </span>
        <span className="m-0 lh-sm d-inline">{row.original.email}</span>
      </div>
    </div>
  );
});

const RolesColumn = memo(function RolesColumn({row}: {row: Row<thisUsuarios>}) {
  const {updateUsuariosCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.usuariosCell !== USUARIOS_CELLS.roles) toggleHandler();
    updateUsuariosCell(USUARIOS_CELLS.roles);
    toggleHandler();
  }, [rolesUsuarios.usuariosCell, row, updateUsuariosCell]);

  const numRoles: string = useMemo(() => {
    return `${row.original.roles.length} ${row.original.roles.length === 1 ? 'rol' : 'roles'}`;
  }, [row.original.roles.length]);

  const getfeedbackIcon = (): string => {
    return row.getIsExpanded() && rolesUsuarios.usuariosCell === USUARIOS_CELLS.roles ? '👇' : '👉';
  };

  return (
    <div
      className={`ribbon-box no-user-text-selectable ${row.getCanExpand() && 'cursor-pointer scale-hover'}`}
      onClick={onClickHandled}>
      {row.getCanExpand() && (
        <span className="me-1" style={{width: '20px', height: '20px'}}>
          {getfeedbackIcon()}
        </span>
      )}
      <Badge bg="" pill className="me-1 badge-outline-info font-14">
        {numRoles}
      </Badge>
    </div>
  );
});

const PermisosOtorgadosColumn = memo(function PermisosOtorgadosColumn({row}: {row: Row<thisUsuarios>}) {
  const {updateUsuariosCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.usuariosCell !== USUARIOS_CELLS.permisosOtorgados) toggleHandler();
    updateUsuariosCell(USUARIOS_CELLS.permisosOtorgados);
    toggleHandler();
  }, [rolesUsuarios.usuariosCell, row, updateUsuariosCell]);

  const numPermisosOtorgados: string = useMemo(() => {
    return `${row.original.permisosOtorgados.length} ${row.original.permisosOtorgados.length === 1 ? 'permiso' : 'permisos'}`;
  }, [row.original.permisosOtorgados.length]);

  const getfeedbackIcon = (): string => {
    return row.getIsExpanded() && rolesUsuarios.usuariosCell === USUARIOS_CELLS.permisosOtorgados ? '👇' : '👉';
  };

  return (
    <div
      className={`ribbon-box no-user-text-selectable ${row.getCanExpand() && 'cursor-pointer scale-hover'}`}
      onClick={onClickHandled}>
      {row.getCanExpand() && (
        <span className="me-1" style={{width: '20px', height: '20px'}}>
          {getfeedbackIcon()}
        </span>
      )}
      <Badge bg="" pill className="me-1 badge-outline-success font-14">
        {numPermisosOtorgados}
      </Badge>
    </div>
  );
});

const PermisosDenegadosColumn = memo(function PermisosDenegadosColumn({row}: {row: Row<thisUsuarios>}) {
  const {updateUsuariosCell, rolesUsuarios} = useRolesUsuariosContext();

  const onClickHandled = useCallback(() => {
    const toggleHandler = row.getToggleExpandedHandler();
    if (row.getIsExpanded() && rolesUsuarios.usuariosCell !== USUARIOS_CELLS.permisosDenegados) toggleHandler();
    updateUsuariosCell(USUARIOS_CELLS.permisosDenegados);
    toggleHandler();
  }, [rolesUsuarios.usuariosCell, row, updateUsuariosCell]);

  const numPermisosDenegados: string = useMemo(() => {
    return `${row.original.permisosDenegados.length} ${row.original.permisosDenegados.length === 1 ? 'permiso' : 'permisos'}`;
  }, [row.original.permisosDenegados.length]);

  const getfeedbackIcon = (): string => {
    return row.getIsExpanded() && rolesUsuarios.usuariosCell === USUARIOS_CELLS.permisosDenegados ? '👇' : '👉';
  };

  return (
    <div
      className={`ribbon-box no-user-text-selectable ${row.getCanExpand() && 'cursor-pointer scale-hover'}`}
      style={{transformOrigin: 'center'}}
      onClick={onClickHandled}>
      {row.getCanExpand() && (
        <span className="me-1" style={{width: '20px', height: '20px'}}>
          {getfeedbackIcon()}
        </span>
      )}
      <Badge bg="" pill className="me-1 badge-outline-danger font-14">
        {numPermisosDenegados}
      </Badge>
    </div>
  );
});

const usuariosColumns: ColumnDef<thisUsuarios>[] = [
  {
    header: 'Usuario',
    accessorKey: 'usuario',
    cell: UsuariosColumn,
    size: 200
  },
  {
    header: 'Cargo',
    accessorKey: 'cargo'
  },
  {
    header: 'Roles',
    accessorKey: 'roles',
    cell: RolesColumn,
    size: 60,
    enableResizing: false
  },
  {
    header: 'Permisos Otorgados',
    accessorKey: 'permisosOtorgados',
    cell: PermisosOtorgadosColumn,
    size: 80,
    enableResizing: false
  },
  {
    header: 'Permisos Denegados',
    accessorKey: 'permisosDenegados',
    cell: PermisosDenegadosColumn,
    size: 80,
    enableResizing: false
  }
];

export {usuariosColumns};
