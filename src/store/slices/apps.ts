import {APPS_NAME} from '@/constants';
import {Apps, PayLoadAppsType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadAppsType = {
  apps: SessionStorageUtil.getItem<Apps[]>(APPS_NAME) ?? ([] as Apps[]),
  isLoading: false
};

export const appsSlice = createSlice({
  name: APPS_NAME,
  initialState,
  reducers: {
    setApps: (state: PayLoadAppsType, action: PayloadAction<Apps[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Apps[]>(APPS_NAME, action.payload);
      state.apps = action.payload;
    },
    clearApps: (state: PayLoadAppsType) => {
      SessionStorageUtil.removeItem(APPS_NAME);
      state.apps = [];
    },
    isLoadingApps: (state: PayLoadAppsType, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {setApps, clearApps, isLoadingApps} = appsSlice.actions;
export default appsSlice.reducer;
