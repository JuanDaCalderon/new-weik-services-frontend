import {Registros} from '@/types';
import type {ColumnDef} from '@tanstack/react-table';

const columns: ColumnDef<Registros>[] = [
  {
    header: 'Fecha de solicitud',
    accessorKey: 'requestAt'
  },
  {
    header: 'Fecha de entrega',
    accessorKey: 'deliverAt'
  },
  {
    header: 'Nombre del proyecto',
    accessorKey: 'nombre'
  },
  {
    header: 'Cliente',
    accessorKey: 'cliente'
  },
  {
    header: 'Solicitante',
    accessorKey: 'solicitante'
  },
  {
    header: 'Número de orden',
    accessorKey: 'numeroOrden'
  },
  {
    header: 'Prioridad',
    accessorKey: 'prioridad'
  },
  {
    header: 'Encargado',
    accessorKey: 'encargado'
  },
  {
    header: 'Estado',
    accessorKey: 'estado'
  }
];

export {columns};
