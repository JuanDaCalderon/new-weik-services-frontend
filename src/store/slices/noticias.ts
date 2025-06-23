import {NOTICIAS_NAME} from '@/constants';
import {Noticia, PayLoadNoticiasType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadNoticiasType = {
  noticias: SessionStorageUtil.getItem<Noticia[]>(NOTICIAS_NAME) ?? ([] as Noticia[]),
  isLoading: false
};

export const noticiasSlice = createSlice({
  name: NOTICIAS_NAME,
  initialState,
  reducers: {
    setNoticias: (state: PayLoadNoticiasType, action: PayloadAction<Noticia[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Noticia[]>(NOTICIAS_NAME, action.payload);
      state.noticias = action.payload;
    },
    clearNoticias: (state: PayLoadNoticiasType) => {
      SessionStorageUtil.removeItem(NOTICIAS_NAME);
      state.noticias = [];
    },
    isLoadingNoticias: (state: PayLoadNoticiasType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {setNoticias, clearNoticias, isLoadingNoticias} = noticiasSlice.actions;
export default noticiasSlice.reducer;
