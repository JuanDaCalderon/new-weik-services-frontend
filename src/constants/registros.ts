import {RegistrosFilterMode} from '@/types';

export enum CUSTOM_FIELD_TYPE {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select'
}

export enum REGISTRO_ASSIGNMENT {
  SINASIGNAR = 'SINASIGNAR',
  ASIGNADO = 'ASIGNADO'
}

export enum REGISTRO_STATUS {
  PAUSA = 'PAUSA',
  ENPROGRESO = 'ENPROGRESO',
  COMPLETADO = 'COMPLETADO',
  ENTREGADO = 'ENTREGADO'
}

export enum REGISTRO_STATUS_SIN_ENTREGADO {
  ALL = 'ALL',
  PAUSA = 'PAUSA',
  ENPROGRESO = 'ENPROGRESO',
  COMPLETADO = 'COMPLETADO'
}

export enum REGISTRO_PRIORIDAD {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAJA = 'BAJA',
  SINPRIORIDAD = 'SINPRIORIDAD'
}

export const REGISTRO_FILTER_MODE_DEFAULT: RegistrosFilterMode = {
  isInEstado: false,
  isInDeliveryDate: false,
  isInRequestDate: false,
  isInRangeDates: false,
  isInPrioridad: false
};
