import type {CellContext, ColumnDef} from '@tanstack/react-table';
import {CustomFieldDefinition, ExportColumn, Registros, TipoRegistro, Option, Employee} from '@/types';
import {useMemo, createElement} from 'react';
import {
  CUSTOM_FIELD_TYPE,
  PERMISOS_MAP_IDS,
  REGISTRO_ASSIGNMENT,
  REGISTRO_PRIORIDAD,
  REGISTRO_STATUS
} from '@/constants';
import {useTranslation} from 'react-i18next';
import TextInputColumn from '@/pages/clientes/registros/components/columns/TextInputColumn';
import SelectInputColumn from '@/pages/clientes/registros/components/columns/SelectInputColumn';
import DateInputColumn from '@/pages/clientes/registros/components/columns/DateInputColumn';
import DateTimeInputColumn from '@/pages/clientes/registros/components/columns/DateTimeInputColumn';
import SwitchInputColumn from '@/pages/clientes/registros/components/columns/SwitchInputColumn';
import NumberInputColumn from '@/pages/clientes/registros/components/columns/NumberInputColumn';
import VerColumn from '@/pages/clientes/registros/components/columns/VerColumn';
import SubrowColumn from '@/pages/clientes/registros/components/columns/SubrowColumn';
import ExpandHeader from '@/pages/clientes/registros/components/columns/ExpandHeader';

import {useAppSelector} from '@/store';
import {selectEmployees, selectisLoadingEmployees, selectUser} from '@/store/selectores';
import {getNombreCompletoUser, hasPermission} from '@/utils';

export const useGetColumns = (tiposRegistros: TipoRegistro[] = [], registerType: string) => {
  const {id} = useAppSelector(selectUser);
  const users = useAppSelector(selectEmployees);
  const isLoadingUsers = useAppSelector(selectisLoadingEmployees);
  const {t} = useTranslation();
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
      {field: 'isSubRegistro' as keyof Registros, header: 'Es un subregistro o Ajuste'},
      ...customFields.map((field) => ({
        field: field.key as keyof Registros,
        header: field.key.charAt(0).toUpperCase() + field.key.slice(1)
      })),
      {field: 'estado' as keyof Registros, header: 'Estado'}
    ];
  }, [customFields]);

  const prioridadLabels = useMemo(() => {
    return {
      [REGISTRO_PRIORIDAD.SINPRIORIDAD]: t('clientes.registros.filter.priority.no_priority'),
      [REGISTRO_PRIORIDAD.ALTA]: t('clientes.registros.filter.priority.high'),
      [REGISTRO_PRIORIDAD.MEDIA]: t('clientes.registros.filter.priority.medium'),
      [REGISTRO_PRIORIDAD.BAJA]: t('clientes.registros.filter.priority.low')
    };
  }, [t]);

  const estadoLabels = useMemo(() => {
    return {
      [REGISTRO_STATUS.ENPROGRESO]: t('clientes.registros.filter.status.in_progress'),
      [REGISTRO_STATUS.PAUSA]: t('clientes.registros.filter.status.on_hold'),
      [REGISTRO_STATUS.COMPLETADO]: t('clientes.registros.filter.status.completed'),
      [REGISTRO_STATUS.ENTREGADO]: t('clientes.registros.filter.status.delivered')
    };
  }, [t]);

  const usersToAssignRegister: Option[] = useMemo(() => {
    const defaultSinAsignar = [
      {value: REGISTRO_ASSIGNMENT.SINASIGNAR, label: t('clientes.registros.filter.unassigned')}
    ];
    if (users.length === 0) return defaultSinAsignar;
    const employeesOptions = users
      .filter((u: Employee) => {
        const canBeAssigned = hasPermission(
          PERMISOS_MAP_IDS.asignarRegistros,
          u.roles,
          u.permisosOtorgados,
          u.permisosDenegados
        );
        return canBeAssigned && u.id !== id;
      })
      .map((u: Employee) => ({value: u.id, label: getNombreCompletoUser(u)}));
    return [...defaultSinAsignar, ...employeesOptions];
  }, [id, t, users]);

  const registrosColumns: ColumnDef<Registros>[] = [
    {
      header: 'Ver',
      accessorKey: 'comentarios',
      size: 58,
      enableResizing: false,
      cell: (cellContext) =>
        createElement(VerColumn, {
          row: cellContext.row,
          registerType,
          showSubRegisterIcon: true
        })
    },
    {
      header: (cellContext) =>
        createElement(ExpandHeader, {
          table: cellContext.table
        }),
      accessorKey: 'isSubRegistro',
      size: 28,
      enableResizing: false,
      cell: SubrowColumn
    },
    {
      header: 'Fecha de solicitud',
      accessorKey: 'requestAt',
      minSize: 100,
      size: 160,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(DateInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'requestAt'
        })
    },
    {
      header: 'Fecha de entrega',
      accessorKey: 'deliverAt',
      minSize: 160,
      size: 260,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(DateTimeInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'deliverAt',
          showStatusIcons: true
        })
    },
    {
      header: 'Proyecto',
      accessorKey: 'nombre',
      minSize: 80,
      size: 200,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(TextInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'nombre',
          showSubRowIcon: true,
          showLinkIcon: true
        })
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      minSize: 80,
      size: 140,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(SelectInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'estado',
          options: Object.entries(estadoLabels).map(([value, label]) => ({
            value,
            label
          }))
        })
    },
    {
      header: 'Prioridad',
      accessorKey: 'prioridad',
      minSize: 80,
      size: 130,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(SelectInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'prioridad',
          options: Object.entries(prioridadLabels).map(([value, label]) => ({
            value,
            label
          }))
        })
    },
    {
      header: 'Encargado',
      accessorKey: 'encargado',
      minSize: 80,
      size: 140,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(SelectInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'encargado',
          options: usersToAssignRegister,
          isLoadingOptions: isLoadingUsers
        })
    },
    {
      header: 'Cliente',
      accessorKey: 'cliente',
      minSize: 80,
      size: 160,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(TextInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'cliente'
        })
    },
    {
      header: 'Solicitante',
      accessorKey: 'solicitante',
      minSize: 80,
      size: 160,
      enableResizing: true,
      cell: (cellContext) =>
        createElement(TextInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'solicitante'
        })
    },
    ...customFields.map((field) => ({
      header: field.key.charAt(0).toUpperCase() + field.key.slice(1),
      accessorKey: field.key,
      size: field.type === CUSTOM_FIELD_TYPE.BOOLEAN || field.type === CUSTOM_FIELD_TYPE.NUMBER ? 80 : 120,
      minSize: 40,
      enableResizing: true,
      ...(field.type === CUSTOM_FIELD_TYPE.BOOLEAN && {
        cell: (cellContext: CellContext<Registros, unknown>) =>
          createElement(SwitchInputColumn, {
            row: cellContext.row,
            registerType,
            field: field.key as keyof Registros
          })
      }),
      ...(field.type === CUSTOM_FIELD_TYPE.NUMBER && {
        cell: (cellContext: CellContext<Registros, unknown>) =>
          createElement(NumberInputColumn, {
            row: cellContext.row,
            registerType,
            field: field.key as keyof Registros
          })
      }),
      ...(field.type === CUSTOM_FIELD_TYPE.STRING && {
        cell: (cellContext: CellContext<Registros, unknown>) =>
          createElement(TextInputColumn, {
            row: cellContext.row,
            registerType,
            field: field.key as keyof Registros
          })
      }),
      ...(field.type === CUSTOM_FIELD_TYPE.SELECT && {
        cell: (cellContext: CellContext<Registros, unknown>) =>
          createElement(SelectInputColumn, {
            row: cellContext.row,
            registerType,
            field: field.key as keyof Registros,
            options:
              field.options?.map((option) => ({
                value: option,
                label: option
              })) || []
          })
      })
    })),
    {
      header: 'Núm de orden',
      accessorKey: 'numeroOrden',
      size: 120,
      enableResizing: false,
      cell: (cellContext) =>
        createElement(TextInputColumn, {
          row: cellContext.row,
          registerType,
          field: 'numeroOrden'
        })
    }
  ];

  return {
    registrosColumnsPdf,
    registrosColumns
  };
};
