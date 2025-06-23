import {RootState} from '@/store';
import {Horario} from '@/types';
import {createSelector} from '@reduxjs/toolkit';

export const selectHorarios = (state: RootState): Horario[] => state.horarios.horarios;

export const selectIsLoadingHorarios = (state: RootState): boolean => state.horarios.isLoading;

export const selectVacacionesPerUserId = (userId: string) =>
  createSelector(
    (state: RootState) => state.horarios.horarios,
    (horarios) => horarios.filter((h) => h.userId === userId)
  );
