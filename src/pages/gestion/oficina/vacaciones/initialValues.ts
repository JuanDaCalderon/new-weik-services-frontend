import {VacacionesType} from '@/types';

export const VACACIONESCREATEDVALUES: VacacionesType = {
  uuid: '',
  approver: '',
  rangoFechas: [],
  aprobadas: null
};

export const VACACIONESEDITVALUES: Partial<VacacionesType> = {
  approver: '',
  rangoFechas: []
};
