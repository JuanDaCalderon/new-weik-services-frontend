import {Vacaciones} from '@/types';

export const VACACIONESCREATEDVALUES: Vacaciones = {
  approver: '',
  rangoFechas: [],
  aprobadas: null
} as unknown as Vacaciones;

export const VACACIONESEDITVALUES: Partial<Vacaciones> = {
  id: '',
  approver: '',
  rangoFechas: []
};
