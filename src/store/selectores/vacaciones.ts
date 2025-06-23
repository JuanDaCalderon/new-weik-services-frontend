import {RootState} from '@/store';
import {Vacaciones} from '@/types';
import {createSelector} from '@reduxjs/toolkit';

export const selectVacaciones = (state: RootState): Vacaciones[] => state.vacaciones.vacaciones;

export const selectIsLoadingVacaciones = (state: RootState): boolean => state.vacaciones.isLoading;

export const selectVacacionesPerUserId = (userId: string) =>
  createSelector(
    (state: RootState) => state.vacaciones.vacaciones,
    (vacaciones) => vacaciones.filter((v) => v.userId === userId)
  );
