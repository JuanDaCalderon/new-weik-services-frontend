import {Cliente} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';
import type {Row} from '@tanstack/react-table';
import {memo} from 'react';
import {Button} from 'react-bootstrap';

const clientesAcciones = memo(function RolNameColumn({row}: {row: Row<Cliente>}) {
  console.log('🚀 ~ clientesAcciones ~ row:', row);
  return (
    <div className="d-flex gap-1">
      <Button type="button" variant="outline-primary py-0 px-1">
        <i className="uil-pen"></i>
      </Button>
      <Button type="button" variant="outline-danger py-0 px-1">
        <i className="uil-trash"></i>
      </Button>
    </div>
  );
});

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
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: clientesAcciones
  }
];

export {columns};
