import {Timestamp} from 'firebase/firestore';

export interface calendarEventTypeBase {
  id: string;
}

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

export interface calendarEventoEventType extends calendarEventTypeBase {
  evento: Eventos;
}

export type PayLoadEventosType = {
  eventos: Eventos[];
  isLoading: boolean;
};
