import {APPS_NAME, SESSION_APPS_KEY} from '@/constants';
import {Apps, PayLoadAppsType} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadAppsType = {
  apps: SessionStorageUtil.getItem<Apps[]>(SESSION_APPS_KEY) ?? ([] as Apps[]),
  isLoading: false
};

export const appsSlice = createSlice({
  name: APPS_NAME,
  initialState,
  reducers: {
    setApps: (state: PayLoadAppsType, action: PayloadAction<Apps[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Apps[]>(SESSION_APPS_KEY, action.payload);
      return {
        ...state,
        apps: action.payload
      };
    },
    clearApps: (state: PayLoadAppsType) => {
      SessionStorageUtil.removeItem(SESSION_APPS_KEY);
      return {
        ...state,
        apps: []
      };
    },
    isLoadingApps: (state: PayLoadAppsType, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoading: action.payload
      };
    }
  }
});

export const {setApps, clearApps, isLoadingApps} = appsSlice.actions;
export default appsSlice.reducer;
