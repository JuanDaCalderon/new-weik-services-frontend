import {Option} from '@/types';

export enum RIBBONTYPES {
  danger = 'danger',
  success = 'success',
  warning = 'warning',
  info = 'info'
}

export const THIS_CLIENT_INFO = {DOMAIN: 'weikstudio', LABEL: 'Weik Motion Studio'};

export enum EVENTTYPES {
  horario = 'horario',
  evento = 'evento',
  vacaciones = 'vacaciones'
}

export const EVENTTYPESOPTIONS: Option[] = [
  {
    label: 'Horario de un usuario',
    value: EVENTTYPES.horario
  },
  {
    label: 'Evento general',
    value: EVENTTYPES.evento
  }
];
