import {RegistrosFilterMode} from '@/types';

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

export const SESSIONSTORAGE_LOAD_DELIVERED_RECORDS = 'shouldLoadDeliveredRecords';
export const SESSIONSTORAGE_LOAD_PENDING_RECORDS = 'shouldLoadPendingRecords';
