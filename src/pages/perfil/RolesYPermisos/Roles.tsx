import {useAppSelector} from '@/store';
import type {ColumnDef} from '@tanstack/react-table';
import {rolesSelector, selectUser} from '@/store/selectores';
import ReactTable from '@/components/table/ReactTable';
import {memo, useMemo} from 'react';
import {Rol} from '@/types';

const columns: ColumnDef<Rol>[] = [
  {
    header: 'Rol',
    accessorKey: 'rol'
  },
  {
    header: 'Descripcion',
    accessorKey: 'descripcion'
  }
];

const Roles = memo(function Roles() {
  const roles = useAppSelector(rolesSelector);
  const user = useAppSelector(selectUser);

  const rolesFiltered: Rol[] = useMemo(() => {
    if (roles.length <= 0) return [];
    if (!user) return [];
    const rolesUser = user.roles.map((rol) => rol.id);
    return roles.filter((rol) => rolesUser.includes(rol.id));
  }, [roles, user]);

  return (
    <ReactTable<Rol> columns={columns} data={rolesFiltered} pageSize={10} tableClass="table-striped" showPagination />
  );
});

export {Roles};
