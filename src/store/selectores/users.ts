import {RootState} from '@/store';

export const selectEmployees = (state: RootState) => state.usuarios.users;

export const selectisLoadingEmployees = (state: RootState) => state.usuarios.isLoading;
