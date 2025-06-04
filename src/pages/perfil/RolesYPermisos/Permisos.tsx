import {useAppSelector} from '@/store';
import type {ColumnDef} from '@tanstack/react-table';
import {permisosSelector, selectUser} from '@/store/selectores';
import {Permiso} from '@/types';
import {memo, useMemo} from 'react';
import ReactTable from '@/components/tablev02/ReactTable';

const columns: ColumnDef<Permiso>[] = [
  {
    header: 'Permisos asociados',
    accessorKey: 'labelName',
    enableResizing: false
  }
];

const Permisos = memo(function Permisos() {
  const permisos = useAppSelector(permisosSelector);
  const user = useAppSelector(selectUser);

  const permisosFiltered: Permiso[] = useMemo(() => {
    if (permisos.length <= 0) return [];
    if (!user) return [];
    const permisosAsociados: Permiso[] = [];
    const permisosDelRolDelUsuario = user.roles.map((rol) => rol.permisos).flat();
    const permisosOtorgadosUser = user.permisosOtorgados.map((permiso) => permiso.id);
    const permisosDenegadosUser = user.permisosDenegados.map((permiso) => permiso.id);
    const permisosSet = new Set<string>();
    permisosOtorgadosUser.forEach((id) => {
      if (!permisosDelRolDelUsuario.some((permiso) => permiso.id === id)) {
        const permiso = permisos.find((p) => p.id === id);
        if (permiso && !permisosSet.has(permiso.id)) {
          permisosAsociados.push(permiso);
          permisosSet.add(permiso.id);
        }
      }
    });
    permisosDelRolDelUsuario.forEach((permiso) => {
      if (!permisosSet.has(permiso.id)) {
        permisosAsociados.push(permiso);
        permisosSet.add(permiso.id);
      }
    });
    return permisosAsociados.filter((permiso) => !permisosDenegadosUser.includes(permiso.id));
  }, [permisos, user]);

  return (
    <ReactTable<Permiso>
      columns={columns}
      data={permisosFiltered}
      pageSize={10}
      tableClass="table-striped"
      showPagination
    />
  );
});

export {Permisos};
