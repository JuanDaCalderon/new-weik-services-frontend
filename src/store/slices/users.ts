import {USERS_NAME} from '@/constants';
import {Employee, PayLoadUsers} from '@/types';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadUsers = {
  users: [],
  isLoadingUsers: false
};

export const usersSlice = createSlice({
  name: USERS_NAME,
  initialState,
  reducers: {
    setUsers: (state: PayLoadUsers, action: PayloadAction<Employee[]>) => {
      return {
        ...state,
        users: [...action.payload]
      };
    },
    setIsloadingUsers: (state: PayLoadUsers, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoadingUsers: action.payload
      };
    },
    clearUsers: (_state: PayLoadUsers, action: PayloadAction<boolean>) => {
      return {
        users: [],
        isLoadingUsers: action.payload ?? false
      };
    }
  }
});

export const {setUsers, clearUsers, setIsloadingUsers} = usersSlice.actions;
export default usersSlice.reducer;
