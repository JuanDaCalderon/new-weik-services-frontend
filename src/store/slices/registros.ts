import {REGISTROS_NAME} from '@/constants';
import {Registros, PayLoadRegistrosType} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadRegistrosType = {
  registros: {}
};
export const registrosSlice = createSlice({
  name: REGISTROS_NAME,
  initialState,
  reducers: {
    setRegistrosPerCliente: (
      state: PayLoadRegistrosType,
      action: PayloadAction<{registros: Registros[]; cliente: string; tipo: string}>
    ) => {
      const {registros, cliente, tipo} = action.payload;
      if (!state.registros[cliente]) {
        state.registros[cliente] = {};
      }
      state.registros[cliente][tipo] = {
        registros,
        isLoading: state.registros[cliente][tipo]?.isLoading || false
      };
    },
    clearRegistros: (state: PayLoadRegistrosType) => {
      state.registros = {};
    },
    clearRegistrosPerClienteAndTipo: (
      state: PayLoadRegistrosType,
      action: PayloadAction<{cliente: string; tipo: string}>
    ) => {
      const {cliente, tipo} = action.payload;
      if (state.registros[cliente] && state.registros[cliente][tipo]) {
        state.registros[cliente][tipo].registros = [];
      }
    },
    isLoadingRegistrosPerCliente: (
      state: PayLoadRegistrosType,
      action: PayloadAction<{cliente: string; tipo: string; isLoading: boolean}>
    ) => {
      const {cliente, tipo, isLoading} = action.payload;
      if (!state.registros[cliente]) {
        state.registros[cliente] = {};
      }
      if (!state.registros[cliente][tipo]) {
        state.registros[cliente][tipo] = {
          registros: [],
          isLoading
        };
      } else {
        state.registros[cliente][tipo].isLoading = isLoading;
      }
    }
  }
});

export const {clearRegistros, isLoadingRegistrosPerCliente, setRegistrosPerCliente, clearRegistrosPerClienteAndTipo} =
  registrosSlice.actions;
export default registrosSlice.reducer;
