import {Timestamp} from 'firebase/firestore';

interface BaseNoticia {
  image: string;
  titulo: string;
  link: string;
}

export interface Noticia extends BaseNoticia {
  id: string;
  rangoFechas: [string, string];
}

export interface MapNoticia extends BaseNoticia {
  id: string;
  expFechas: string;
  rangoFechas?: [Date, Date];
  hasExpired?: boolean;
}

export interface NoticiaToDb extends BaseNoticia {
  rangoFechas: Timestamp[];
}

export type PayLoadNoticiasType = {
  noticias: Noticia[];
  isLoading: boolean;
};

export type noticiaCreationType = {
  titulo: string;
  link: string;
};
