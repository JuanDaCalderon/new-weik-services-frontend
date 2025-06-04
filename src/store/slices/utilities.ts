import {LOCALSTORAGE_EXPAND_NOTICIAS_BOARD, UTILITIES_NAME} from '@/constants';
import {LocalStorageUtil} from '@/utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  noticias: {
    isExpanded: LocalStorageUtil.getItem<boolean>(LOCALSTORAGE_EXPAND_NOTICIAS_BOARD) ?? true
  }
};

export const utilitiesSlice = createSlice({
  name: UTILITIES_NAME,
  initialState,
  reducers: {
    setNoticiasExpanded: (state, action: PayloadAction<boolean>) => {
      state.noticias.isExpanded = action.payload;
      LocalStorageUtil.setItem<boolean>(LOCALSTORAGE_EXPAND_NOTICIAS_BOARD, action.payload);
    }
  }
});

export const {setNoticiasExpanded} = utilitiesSlice.actions;
export default utilitiesSlice.reducer;
