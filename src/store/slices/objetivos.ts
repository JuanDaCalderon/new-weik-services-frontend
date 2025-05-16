import {OBJETIVOS_NAME} from '@/constants';
import {Objetivos, PayLoadObjetivosType} from '@/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadObjetivosType = {
  objetivos: [],
  isLoading: false
};

export const objetivosSlice = createSlice({
  name: OBJETIVOS_NAME,
  initialState,
  reducers: {
    setObjetivos: (state: PayLoadObjetivosType, action: PayloadAction<Objetivos[]>) => {
      if (state.objetivos.length === 0) {
        return {
          ...state,
          objetivos: action.payload
        };
      }
    },
    clearObjetivos: (state: PayLoadObjetivosType) => {
      return {
        ...state,
        objetivos: []
      };
    },
    isLoadingObjetivos: (state: PayLoadObjetivosType, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoading: action.payload
      };
    }
  }
});

export const {clearObjetivos, isLoadingObjetivos, setObjetivos} = objetivosSlice.actions;
export default objetivosSlice.reducer;
