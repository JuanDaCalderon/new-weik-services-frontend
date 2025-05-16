import {RootState} from '@/store';
import {Objetivos} from '@/types';

export const selectObjetivos = (state: RootState): Objetivos[] => state.objetivos.objetivos;

export const selectIsLoadingObjetivos = (state: RootState): boolean => state.objetivos.isLoading;
