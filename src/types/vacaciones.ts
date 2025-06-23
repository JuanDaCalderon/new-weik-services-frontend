import {Timestamp} from 'firebase/firestore';

interface BaseVacaciones {
  userId: string;
  approver: string;
  aprobadas: boolean | null;
}

export interface Vacaciones extends BaseVacaciones {
  id: string;
  rangoFechas: string[];
}

export interface VacacionesToFirestore extends BaseVacaciones {
  rangoFechas: Timestamp[];
}

export type PayLoadVacacionesType = {
  vacaciones: Vacaciones[];
  isLoading: boolean;
};
