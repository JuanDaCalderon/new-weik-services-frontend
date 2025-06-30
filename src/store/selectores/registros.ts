import {RootState} from '@/store';
import {ClienteRegistros, TypeRegister} from '@/types';
import {organizeRegistrosConJerarquia} from '@/utils';
import {createSelector} from '@reduxjs/toolkit';

export const selectRegistrosByClienteYTipo = (cliente: string, tipo: string) =>
  createSelector(
    (state: RootState) => state.registros.registros,
    (registros) => {
      if (!registros[cliente]) {
        return {registros: [], isLoading: false} as TypeRegister;
      }
      if (!registros[cliente]?.[tipo]) {
        return {registros: [], isLoading: false} as TypeRegister;
      }
      return {
        ...registros[cliente][tipo],
        registros: organizeRegistrosConJerarquia(registros[cliente][tipo].registros)
      } as TypeRegister;
    }
  );

export const selectRegistros = (state: RootState): Record<string, ClienteRegistros> => state.registros.registros;
