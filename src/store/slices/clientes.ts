import {CLIENTES_NAME, SESSION_CLIENTES_KEY} from '@/constants';
import {Cliente} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: Cliente[] =
  SessionStorageUtil.getItem<Cliente[]>(SESSION_CLIENTES_KEY) ?? ([] as Cliente[]);

export const clientesSlice = createSlice({
  name: CLIENTES_NAME,
  initialState,
  reducers: {
    setClientes: (_state: Cliente[], action: PayloadAction<Cliente[]>) => {
      SessionStorageUtil.setItem<Cliente[]>(SESSION_CLIENTES_KEY, action.payload);
      return [...action.payload];
    },
    clearClientes: () => {
      SessionStorageUtil.removeItem(SESSION_CLIENTES_KEY);
      return [];
    }
  }
});

export const {setClientes, clearClientes} = clientesSlice.actions;
export default clientesSlice.reducer;
