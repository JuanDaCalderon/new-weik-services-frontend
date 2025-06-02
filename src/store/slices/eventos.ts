import {EVENTOS_NAME, SESSION_EVENTOS_KEY} from '@/constants';
import {Eventos, PayLoadEventosType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadEventosType = {
  eventos: SessionStorageUtil.getItem<Eventos[]>(SESSION_EVENTOS_KEY) ?? ([] as Eventos[]),
  isLoading: false
};

export const eventosSlice = createSlice({
  name: EVENTOS_NAME,
  initialState,
  reducers: {
    setEventos: (state: PayLoadEventosType, action: PayloadAction<Eventos[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Eventos[]>(SESSION_EVENTOS_KEY, action.payload);
      state.eventos = action.payload;
    },
    clearEventos: (state: PayLoadEventosType) => {
      SessionStorageUtil.removeItem(SESSION_EVENTOS_KEY);
      state.eventos = [];
    },
    isLoadingEventos: (state: PayLoadEventosType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {clearEventos, isLoadingEventos, setEventos} = eventosSlice.actions;
export default eventosSlice.reducer;
