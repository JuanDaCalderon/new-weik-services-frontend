import type {ColumnDef} from '@tanstack/react-table';
import {CustomFieldDefinition, ExportColumn, Registros, TipoRegistro} from '@/types';
import {useMemo} from 'react';

export const useGetColumns = (tiposRegistros: TipoRegistro[] = [], registerType: string) => {
  const customFields: CustomFieldDefinition[] = useMemo(() => {
    return (
      tiposRegistros.find((tipo) => tipo.tipo.toLowerCase().trim() === registerType.toLowerCase().trim())
        ?.customFields || []
    );
  }, [registerType, tiposRegistros]);

  const registrosColumnsPdf: ExportColumn<Registros>[] = useMemo(() => {
    return [
      {field: 'requestAt' as keyof Registros, header: 'Fecha de solicitud'},
      {field: 'deliverAt' as keyof Registros, header: 'Fecha de entrega'},
      {field: 'nombre' as keyof Registros, header: 'Nombre del proyecto'},
      {field: 'cliente' as keyof Registros, header: 'Cliente'},
      {field: 'solicitante' as keyof Registros, header: 'Solicitante'},
      {field: 'numeroOrden' as keyof Registros, header: 'Número de orden'},
      {field: 'prioridad' as keyof Registros, header: 'Prioridad'},
      {field: 'encargado' as keyof Registros, header: 'Encargado'},
      ...customFields.map((field) => ({
        field: field.key as keyof Registros,
        header: field.key.charAt(0).toUpperCase() + field.key.slice(1)
      })),
      {field: 'estado' as keyof Registros, header: 'Estado'}
    ];
  }, [customFields]);

  const registrosColumns: ColumnDef<Registros>[] = useMemo(() => {
    return [
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
      ...customFields.map((field) => ({
        header: field.key.charAt(0).toUpperCase() + field.key.slice(1),
        accessorKey: field.key,
        size: 100,
        minSize: 40,
        enableResizing: true
      })),
      {
        header: 'Estado',
        accessorKey: 'estado',
        size: 120,
        enableResizing: false
      }
    ];
  }, [customFields]);

  return {
    registrosColumnsPdf,
    registrosColumns
  };
};
