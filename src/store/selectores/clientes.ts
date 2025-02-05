import {RootState} from '@/store';
import {createSelector} from '@reduxjs/toolkit';

export const selectClientes = (state: RootState) => state.clientes.clientes;

export const isLoadingClientes = (state: RootState) => state.clientes.isLoading;

export const clientesOptionsSelector = createSelector([selectClientes], (clientes) =>
  clientes.map(({domain: value, nombre: label}) => ({value, label}))
);
