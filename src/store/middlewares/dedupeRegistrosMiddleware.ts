import {isPlainObject, Middleware, UnknownAction} from '@reduxjs/toolkit';
import {
  clearRegistros,
  isLoadingRegistrosPerCliente,
  setRegistrosPerCliente,
  clearRegistrosPerClienteAndTipo
} from '@/store/slices/registros';
import {RootState} from '@/store';
import {Registros} from '@/types';

export const dedupeRegistrosMiddleware: Middleware = (store) => (next) => (action) => {
  if (!isPlainObject(action)) return next(action);
  const state = store.getState() as RootState;

  if ((action as UnknownAction).type === setRegistrosPerCliente.type) {
    const {registros, cliente, tipo} = (
      action as UnknownAction & {payload: {registros: Registros[]; cliente: string; tipo: string}}
    ).payload;
    const current = state.registros.registros?.[cliente]?.[tipo];
    if (current) {
      const areEqual =
        current.registros.length === registros.length &&
        JSON.stringify(current.registros) === JSON.stringify(registros);
      if (areEqual) return;
    }
  }

  if ((action as UnknownAction).type === clearRegistros.type) {
    const isEmpty = Object.values(state.registros.registros).every((cliente) =>
      Object.values(cliente).every((tipo) => tipo.registros.length === 0)
    );
    if (isEmpty) return;
  }

  if ((action as UnknownAction).type === clearRegistrosPerClienteAndTipo.type) {
    const {cliente, tipo} = (action as UnknownAction & {payload: {cliente: string; tipo: string}}).payload;
    const current = state.registros.registros?.[cliente]?.[tipo];
    if (!current) return;
    if (current && current.registros.length === 0) return;
  }

  if ((action as UnknownAction).type === isLoadingRegistrosPerCliente.type) {
    const {cliente, tipo, isLoading} = (
      action as UnknownAction & {payload: {cliente: string; tipo: string; isLoading: boolean}}
    ).payload;
    const current = state.registros.registros?.[cliente]?.[tipo];
    if (current && current.isLoading === isLoading) return;
  }

  return next(action);
};
