import {thisUsuarios} from '@/types';
import {Row as RowTable} from '@tanstack/react-table';
import {memo} from 'react';
import {useRolesUsuariosContext} from '../context';
import {USUARIOS_CELLS} from '@/constants';
import {CargoUsuario, PermisosDenegados, PermisosOtorgados, RoleEnUsuario} from './subComponents';

const RenderSubComponent = ({row}: {row: RowTable<thisUsuarios>}) => {
  const {rolesUsuarios} = useRolesUsuariosContext();
  if (!row || !row.original) return null;
  return (
    <>
      {rolesUsuarios.usuariosCell === USUARIOS_CELLS.cargo && <CargoUsuario row={row} />}
      {rolesUsuarios.usuariosCell === USUARIOS_CELLS.roles && <RoleEnUsuario row={row} />}
      {rolesUsuarios.usuariosCell === USUARIOS_CELLS.permisosOtorgados && <PermisosOtorgados row={row} />}
      {rolesUsuarios.usuariosCell === USUARIOS_CELLS.permisosDenegados && <PermisosDenegados row={row} />}
    </>
  );
};

const MemoizedRenderSubComponent = memo(RenderSubComponent);

export {MemoizedRenderSubComponent};
