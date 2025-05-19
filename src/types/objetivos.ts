import {Timestamp} from 'firebase/firestore';

export enum OBJETIVO_STATUS {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADO = 'COMPLETADO'
}

export interface SelfAssessment {
  stars: 0 | 1 | 2 | 3 | 4 | 5;
  wasReviewed: boolean;
  comment?: string;
}

interface BaseEvaluation {
  stars: 0 | 1 | 2 | 3 | 4 | 5;
  wasReviewed: boolean;
  feedback?: string;
}

export interface Evaluation extends BaseEvaluation {
  evaluatedAt: string;
}

export interface EvaluationToDb extends BaseEvaluation {
  evaluatedAt: Timestamp;
}

interface BaseObjetivos {
  titulo: string;
  descripcion: string;
  userId: string;
  status: OBJETIVO_STATUS;
  requiredSelfAssessment: boolean;
  selfAssessment?: SelfAssessment;
}

export interface Objetivos extends BaseObjetivos {
  id: string;
  rangoFechas: string[];
  evaluation?: Evaluation;
  createdAt: string;
}

export interface ObjetivosToDb extends BaseObjetivos {
  rangoFechas: Timestamp[];
  evaluation?: EvaluationToDb;
  createdAt: Timestamp;
}

export type PayLoadObjetivosType = {
  objetivos: Objetivos[];
  isLoading: boolean;
};
