import {Timestamp} from 'firebase/firestore';

enum OBJETIVO_STATUS {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADO = 'COMPLETADO'
}

interface BaseEvaluation {
  stars: 0 | 1 | 2 | 3 | 4 | 5;
  feedback?: string;
  selfAssessment?: {
    stars: 0 | 1 | 2 | 3 | 4 | 5;
    comment?: string;
  };
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
  evaluatorId: string;
  status: OBJETIVO_STATUS;
}

export interface Objetivos extends BaseObjetivos {
  id: string;
  rangoFechas: [string, string];
  evaluation?: Evaluation;
  createdAt: string;
}

export interface ObjetivosToDb extends BaseObjetivos {
  rangoFechas: [Timestamp, Timestamp];
  evaluation?: EvaluationToDb;
  createdAt: Timestamp;
}

export type PayLoadObjetivosType = {
  objetivos: Objetivos[];
  isLoading: boolean;
};
