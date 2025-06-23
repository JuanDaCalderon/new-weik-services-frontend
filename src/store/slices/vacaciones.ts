import {VACACIONES_NAME} from '@/constants';
import {PayLoadVacacionesType, Vacaciones} from '@/types';
import {LocalStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadVacacionesType = {
  vacaciones: LocalStorageUtil.getItem<Vacaciones[]>(VACACIONES_NAME) ?? ([] as Vacaciones[]),
  isLoading: false
};

export const vacacionesSlice = createSlice({
  name: VACACIONES_NAME,
  initialState,
  reducers: {
    setVacaciones: (state: PayLoadVacacionesType, action: PayloadAction<Vacaciones[]>) => {
      if (action.payload.length > 0) LocalStorageUtil.setItem<Vacaciones[]>(VACACIONES_NAME, action.payload);
      state.vacaciones = action.payload;
    },
    clearVacaciones: (state: PayLoadVacacionesType) => {
      LocalStorageUtil.removeItem(VACACIONES_NAME);
      state.vacaciones = [];
    },
    isLoadingVacaciones: (state: PayLoadVacacionesType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {setVacaciones, clearVacaciones, isLoadingVacaciones} = vacacionesSlice.actions;
export default vacacionesSlice.reducer;
