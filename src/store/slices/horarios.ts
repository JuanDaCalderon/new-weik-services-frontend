import {EVENTOS_NAME} from '@/constants';
import {Eventos, PayLoadEventosType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadEventosType = {
  eventos: SessionStorageUtil.getItem<Eventos[]>(EVENTOS_NAME) ?? ([] as Eventos[]),
  isLoading: false
};

export const eventosSlice = createSlice({
  name: EVENTOS_NAME,
  initialState,
  reducers: {
    setEventos: (state: PayLoadEventosType, action: PayloadAction<Eventos[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Eventos[]>(EVENTOS_NAME, action.payload);
      state.eventos = action.payload;
    },
    clearEventos: (state: PayLoadEventosType) => {
      SessionStorageUtil.removeItem(EVENTOS_NAME);
      state.eventos = [];
    },
    isLoadingEventos: (state: PayLoadEventosType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {clearEventos, isLoadingEventos, setEventos} = eventosSlice.actions;
export default eventosSlice.reducer;
