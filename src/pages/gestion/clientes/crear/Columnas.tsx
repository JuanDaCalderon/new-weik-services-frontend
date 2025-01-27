import {Cliente} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';

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
          className="me-2 rounded-circle"
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
  }
];

export {columns};
