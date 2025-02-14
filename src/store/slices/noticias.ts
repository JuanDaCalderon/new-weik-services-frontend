import {NOTICIAS_NAME} from '@/constants';
import {Noticia, PayLoadNoticiasType} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadNoticiasType = {
  noticias: [],
  isLoading: false
};

export const noticiasSlice = createSlice({
  name: NOTICIAS_NAME,
  initialState,
  reducers: {
    setNoticias: (state: PayLoadNoticiasType, action: PayloadAction<Noticia[]>) => {
      if (state.noticias.length === 0) {
        return {
          ...state,
          noticias: action.payload
        };
      }
    },
    resetNoticias: (state: PayLoadNoticiasType) => {
      return {
        ...state,
        noticias: []
      };
    },
    isLoadingNoticias: (state: PayLoadNoticiasType, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoading: action.payload
      };
    }
  }
});

export const {setNoticias, resetNoticias, isLoadingNoticias} = noticiasSlice.actions;
export default noticiasSlice.reducer;
