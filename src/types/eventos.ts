import {Timestamp} from 'firebase/firestore';
import {HorarioType} from './users';

export type Eventos = {
  id?: string;
  titulo: string;
  descripcion: string;
  rangoFechas: string[];
};

export type EventosToFirestore = {
  id?: string;
  titulo: string;
  descripcion: string;
  rangoFechas: Timestamp[];
};

export type PayLoadEventosType = {
  eventos: Eventos[];
  isLoading: boolean;
};

export type calendarHorarioEventType = {
  id: string;
  horario: HorarioType;
};

export type calendarEventoEventType = {
  id: string;
  evento: Eventos;
};
