import {RootState} from '@/store';

export const selectClientes = (state: RootState) => state.clientes.clientes;

export const isLoadingClientes = (state: RootState) => state.clientes.isLoading;
