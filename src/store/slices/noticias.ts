import {NOTICIAS_NAME, SESSION_NOTICIAS_KEY} from '@/constants';
import {Noticia, PayLoadNoticiasType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadNoticiasType = {
  noticias: SessionStorageUtil.getItem<Noticia[]>(SESSION_NOTICIAS_KEY) ?? ([] as Noticia[]),
  isLoading: false
};

export const noticiasSlice = createSlice({
  name: NOTICIAS_NAME,
  initialState,
  reducers: {
    setNoticias: (state: PayLoadNoticiasType, action: PayloadAction<Noticia[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Noticia[]>(SESSION_NOTICIAS_KEY, action.payload);
      state.noticias = action.payload;
    },
    clearNoticias: (state: PayLoadNoticiasType) => {
      SessionStorageUtil.removeItem(SESSION_NOTICIAS_KEY);
      state.noticias = [];
    },
    isLoadingNoticias: (state: PayLoadNoticiasType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {setNoticias, clearNoticias, isLoadingNoticias} = noticiasSlice.actions;
export default noticiasSlice.reducer;
