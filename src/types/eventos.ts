import {Timestamp} from 'firebase/firestore';
import {HorarioType} from './users';

interface BaseEventos {
  titulo: string;
  descripcion: string;
}

export interface Eventos extends BaseEventos {
  id: string;
  rangoFechas: string[];
}

export interface EventosToDb extends BaseEventos {
  rangoFechas: Timestamp[];
}

interface calendarEventTypeBase {
  id: string;
}

export interface calendarHorarioEventType extends calendarEventTypeBase {
  horario: HorarioType;
}

export interface calendarEventoEventType extends calendarEventTypeBase {
  evento: Eventos;
}

export type PayLoadEventosType = {
  eventos: Eventos[];
  isLoading: boolean;
};
