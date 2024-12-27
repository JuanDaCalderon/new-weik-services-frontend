import {ROLES_CELLS} from '@/constants';
import {useRolesUsuariosContext} from '@/pages/rolesypermisos/context';
import {thisRol} from '@/types';
import {Row as RowTable} from '@tanstack/react-table';
import {memo} from 'react';
import {EdicionRol, PermisosEnRoles, UsuariosEnRoles} from './subComponents';

const RenderSubComponent = ({row}: {row: RowTable<thisRol>}) => {
  const {rolesUsuarios} = useRolesUsuariosContext();
  if (!row || !row.original) return null;
  return (
    <>
      {rolesUsuarios.rolesCell === ROLES_CELLS.permisos && <PermisosEnRoles row={row} />}
      {rolesUsuarios.rolesCell === ROLES_CELLS.rol && <EdicionRol row={row} />}
      {rolesUsuarios.rolesCell === ROLES_CELLS.usuarios && <UsuariosEnRoles row={row} />}
    </>
  );
};

const MemoizedRenderSubComponent = memo(RenderSubComponent);

export {MemoizedRenderSubComponent};
