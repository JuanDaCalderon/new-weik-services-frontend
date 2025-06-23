import {Timestamp} from 'firebase/firestore';
import {calendarEventTypeBase} from './eventos';

interface BaseHorarios {
  userId: string;
  horaInicio: string;
  horasDeTrabajo: number;
  break: number;
}

export interface Horario extends BaseHorarios {
  id: string;
  rangoFechas: string[];
}

export interface HorarioToFirestore extends BaseHorarios {
  rangoFechas: Timestamp[];
}

export interface calendarHorarioEventType extends calendarEventTypeBase {
  horario: Horario;
}

export type PayLoadHorariosType = {
  horarios: Horario[];
  isLoading: boolean;
};
