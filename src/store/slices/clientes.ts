import {CLIENTES_NAME} from '@/constants';
import {Cliente, PayLoadClientType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadClientType = {
  clientes: SessionStorageUtil.getItem<Cliente[]>(CLIENTES_NAME) ?? ([] as Cliente[]),
  isLoading: false
};

export const clientesSlice = createSlice({
  name: CLIENTES_NAME,
  initialState,
  reducers: {
    setClientes: (state: PayLoadClientType, action: PayloadAction<Cliente[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Cliente[]>(CLIENTES_NAME, action.payload);
      state.clientes = action.payload;
    },
    clearClientes: (state: PayLoadClientType) => {
      SessionStorageUtil.removeItem(CLIENTES_NAME);
      state.clientes = [];
    },
    isLoadingClientes: (state: PayLoadClientType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {setClientes, clearClientes, isLoadingClientes} = clientesSlice.actions;
export default clientesSlice.reducer;
