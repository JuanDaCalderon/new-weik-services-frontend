import {Option} from '@/types';

const DEFAULT_PASSWORD = '000000';

/**
 * online | offline | inactivo
 */
enum ESTADOS {
  online = 'online',
  offline = 'offline',
  inactivo = 'inactivo'
}

export {ESTADOS, DEFAULT_PASSWORD};

export enum BREAKMINUTES {
  MIN_15 = '15',
  MIN_30 = '30',
  MIN_45 = '45',
  MIN_60 = '60'
}

export const BREAKSOPTIONS: Option[] = [
  {
    label: BREAKMINUTES.MIN_15 + ' minutos',
    value: BREAKMINUTES.MIN_15
  },
  {
    label: BREAKMINUTES.MIN_30 + ' minutos',
    value: BREAKMINUTES.MIN_30
  },
  {
    label: BREAKMINUTES.MIN_45 + ' minutos',
    value: BREAKMINUTES.MIN_45
  },
  {
    label: BREAKMINUTES.MIN_60 + ' minutos',
    value: BREAKMINUTES.MIN_60
  }
];

export const SESSIONSTORAGE_CALENDAR_USER_SELECTED_KEY = 'userCalendarHorarioSelected';
export const SESSIONSTORAGE_OBJETIVOS_USER_SELECTED_KEY = 'userObjetivosHorarioSelected';
