import {OBJETIVOS_NAME, SESSION_OBJETIVOS_KEY} from '@/constants';
import {Objetivos, PayLoadObjetivosType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadObjetivosType = {
  objetivos: SessionStorageUtil.getItem<Objetivos[]>(SESSION_OBJETIVOS_KEY) ?? ([] as Objetivos[]),
  isLoading: false
};

export const objetivosSlice = createSlice({
  name: OBJETIVOS_NAME,
  initialState,
  reducers: {
    setObjetivos: (state: PayLoadObjetivosType, action: PayloadAction<Objetivos[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Objetivos[]>(SESSION_OBJETIVOS_KEY, action.payload);
      state.objetivos = action.payload;
    },
    clearObjetivos: (state: PayLoadObjetivosType) => {
      SessionStorageUtil.removeItem(SESSION_OBJETIVOS_KEY);
      state.objetivos = [];
    },
    isLoadingObjetivos: (state: PayLoadObjetivosType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {clearObjetivos, isLoadingObjetivos, setObjetivos} = objetivosSlice.actions;
export default objetivosSlice.reducer;
