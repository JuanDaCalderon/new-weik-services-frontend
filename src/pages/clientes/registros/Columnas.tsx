import {Registros} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';

const columns: ColumnDef<Registros>[] = [
  {
    header: 'Fecha de solicitud',
    accessorKey: 'requestAt',
    size: 190,
    enableResizing: false
  },
  {
    header: 'Fecha de entrega',
    accessorKey: 'deliverAt',
    size: 200,
    enableResizing: false
  },
  {
    header: 'Nombre del proyecto',
    accessorKey: 'nombre',
    minSize: 100,
    size: 240,
    enableResizing: true
  },
  {
    header: 'Cliente',
    accessorKey: 'cliente',
    minSize: 60,
    size: 120,
    enableResizing: true
  },
  {
    header: 'Solicitante',
    accessorKey: 'solicitante',
    minSize: 60,
    size: 120,
    enableResizing: true
  },
  {
    header: 'Número de orden',
    accessorKey: 'numeroOrden',
    size: 120,
    enableResizing: false
  },
  {
    header: 'Prioridad',
    accessorKey: 'prioridad',
    size: 100,
    enableResizing: false
  },
  {
    header: 'Encargado',
    accessorKey: 'encargado',
    minSize: 80,
    size: 150,
    enableResizing: true
  },
  {
    header: 'Estado',
    accessorKey: 'estado',
    size: 120,
    enableResizing: false
  }
];

export {columns};
