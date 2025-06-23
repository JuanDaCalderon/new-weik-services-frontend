import {BREAKMINUTES} from '@/constants';
import {Horario} from '@/types';
import {DateUtils} from '@/utils';

export const HORARIOCREATEDVALUES: Horario = {
  userId: '',
  horasDeTrabajo: 8,
  horaInicio: DateUtils.getFormattedTime(false) as string,
  break: +BREAKMINUTES.MIN_30,
  rangoFechas: []
} as unknown as Horario;
