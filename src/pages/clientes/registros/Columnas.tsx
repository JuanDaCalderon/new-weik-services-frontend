import type {ColumnDef} from '@tanstack/react-table';

const columns: ColumnDef<any>[] = [
  {
    header: 'Fecha solicitud',
    accessorKey: 'FechaSolicitud'
  },
  {
    header: 'Fecha Entrega',
    accessorKey: 'FechaEntrega'
  },
  {
    header: 'Cliente',
    accessorKey: 'cliente'
  },
  {
    header: 'Proyecto',
    accessorKey: 'proyecto'
  },
  {
    header: 'Solicitante',
    accessorKey: 'solicitante'
  },
  {
    header: 'Región',
    accessorKey: 'region'
  },
  {
    header: 'Pilares',
    accessorKey: 'pilares'
  },
  {
    header: 'Slides',
    accessorKey: 'slides'
  },
  {
    header: 'Diseñador',
    accessorKey: 'diseñador'
  },
  {
    header: 'Observaciones',
    accessorKey: 'observaciones'
  },
  {
    header: 'Factura',
    accessorKey: 'factura'
  },
  {
    header: 'Estado',
    accessorKey: 'estado'
  }
];

export {columns};
