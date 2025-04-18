import {RootState} from '@/store';
import {Eventos} from '@/types';

export const selectEventos = (state: RootState): Eventos[] => state.eventos.eventos;

export const selectIsLoadingEventos = (state: RootState): boolean => state.eventos.isLoading;
