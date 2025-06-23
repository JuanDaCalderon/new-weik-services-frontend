import {OBJETIVOS_NAME} from '@/constants';
import {Objetivos, PayLoadObjetivosType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadObjetivosType = {
  objetivos: SessionStorageUtil.getItem<Objetivos[]>(OBJETIVOS_NAME) ?? ([] as Objetivos[]),
  isLoading: false
};

export const objetivosSlice = createSlice({
  name: OBJETIVOS_NAME,
  initialState,
  reducers: {
    setObjetivos: (state: PayLoadObjetivosType, action: PayloadAction<Objetivos[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Objetivos[]>(OBJETIVOS_NAME, action.payload);
      state.objetivos = action.payload;
    },
    clearObjetivos: (state: PayLoadObjetivosType) => {
      SessionStorageUtil.removeItem(OBJETIVOS_NAME);
      state.objetivos = [];
    },
    isLoadingObjetivos: (state: PayLoadObjetivosType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {clearObjetivos, isLoadingObjetivos, setObjetivos} = objetivosSlice.actions;
export default objetivosSlice.reducer;
