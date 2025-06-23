import {HORARIOS_NAME} from '@/constants';
import {Horario, PayLoadHorariosType} from '@/types';
import {LocalStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadHorariosType = {
  horarios: LocalStorageUtil.getItem<Horario[]>(HORARIOS_NAME) ?? ([] as Horario[]),
  isLoading: false
};

export const horariosSlice = createSlice({
  name: HORARIOS_NAME,
  initialState,
  reducers: {
    setHorarios: (state: PayLoadHorariosType, action: PayloadAction<Horario[]>) => {
      if (action.payload.length > 0) LocalStorageUtil.setItem<Horario[]>(HORARIOS_NAME, action.payload);
      state.horarios = action.payload;
    },
    clearHorarios: (state: PayLoadHorariosType) => {
      LocalStorageUtil.removeItem(HORARIOS_NAME);
      state.horarios = [];
    },
    isLoadingHorarios: (state: PayLoadHorariosType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {clearHorarios, isLoadingHorarios, setHorarios} = horariosSlice.actions;
export default horariosSlice.reducer;
