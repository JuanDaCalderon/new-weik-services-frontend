import {REGISTRO_ASSIGNMENT, REGISTRO_PRIORIDAD, REGISTRO_STATUS} from '@/constants';
import {Timestamp} from 'firebase/firestore';

export interface RegistrosFilterMode {
  isInRangeDates: boolean;
  isInRequestDate: boolean;
  isInDeliveryDate: boolean;
  isInEstado: boolean;
  isInPrioridad: boolean;
}

interface BaseComentarios {
  comentario: string;
  createdBy: string;
}

export interface Comentarios extends BaseComentarios {
  createdAt: string;
}

export interface ComentariosToBecreated extends BaseComentarios {
  createdAt: Date;
}

export interface ComentariosToDb extends BaseComentarios {
  createdAt: Timestamp;
}

interface BaseRegistros {
  nombre: string;
  link: string;
  cliente: string;
  solicitante: string;
  encargado: string | REGISTRO_ASSIGNMENT.SINASIGNAR;
  estado: REGISTRO_STATUS;
  prioridad: REGISTRO_PRIORIDAD;
  numeroOrden: string;
  createdBy: string;
  updatedBy: string;
  isSubRegistro: boolean;
  parentRegistroId?: string;
  customFields?: {
    [key: string]: {
      value: string | number | boolean;
    };
  };
}

export interface Registros extends BaseRegistros {
  id: string;
  requestAt: string;
  deliverAt: string;
  createdAt: string;
  updatedAt: string;
  comentarios: Comentarios[];
  subRows?: Registros[];
}

export interface RegistrosToDb extends BaseRegistros {
  requestAt: Timestamp;
  deliverAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comentarios: ComentariosToDb[];
}

export type RegistrosToBecreated = Pick<
  Registros,
  | 'nombre'
  | 'link'
  | 'cliente'
  | 'solicitante'
  | 'encargado'
  | 'estado'
  | 'prioridad'
  | 'numeroOrden'
  | 'isSubRegistro'
  | 'parentRegistroId'
> & {
  requestAt: Date;
  deliverAt: Date;
  comentarios: ComentariosToBecreated[];
};

export interface TypeRegister {
  registros: Registros[];
  isLoading: boolean;
}

export type ClienteRegistros = Record<string, TypeRegister>;

export type PayLoadRegistrosType = {
  registros: Record<string, ClienteRegistros>;
};
