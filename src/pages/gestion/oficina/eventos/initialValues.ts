import {BREAKMINUTES} from '@/constants';
import {Eventos, HorarioType} from '@/types';
import {DateUtils} from '@/utils';

export const HORARIOCREATEDVALUES: HorarioType = {
  uuid: '',
  horasDeTrabajo: 8,
  horaInicio: DateUtils.getFormattedTime(false) as string,
  break: +BREAKMINUTES.MIN_30,
  rangoFechas: []
};

export const EVENTOSINITIALVALUES: Eventos = {
  titulo: '',
  descripcion: '',
  rangoFechas: []
} as unknown as Eventos;
