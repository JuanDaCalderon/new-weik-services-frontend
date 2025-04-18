import {EVENTOS_NAME} from '@/constants';
import {Eventos, PayLoadEventosType} from '@/types';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadEventosType = {
  eventos: [],
  isLoading: false
};

export const eventosSlice = createSlice({
  name: EVENTOS_NAME,
  initialState,
  reducers: {
    setEventos: (state: PayLoadEventosType, action: PayloadAction<Eventos[]>) => {
      return {
        ...state,
        eventos: action.payload
      };
    },
    clearEventos: (state: PayLoadEventosType) => {
      return {
        ...state,
        eventos: []
      };
    },
    isLoadingEventos: (state: PayLoadEventosType, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoading: action.payload
      };
    }
  }
});

export const {clearEventos, isLoadingEventos, setEventos} = eventosSlice.actions;
export default eventosSlice.reducer;
