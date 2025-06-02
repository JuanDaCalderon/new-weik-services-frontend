import {USERS_NAME} from '@/constants';
import {Employee, PayLoadUsers} from '@/types';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadUsers = {
  users: [],
  isLoading: false
};

export const usersSlice = createSlice({
  name: USERS_NAME,
  initialState,
  reducers: {
    setUsers: (state: PayLoadUsers, action: PayloadAction<Employee[]>) => {
      state.users = action.payload;
    },
    setIsloadingUsers: (state: PayLoadUsers, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUsers: (state: PayLoadUsers) => {
      state.users = [];
    }
  }
});

export const {setUsers, clearUsers, setIsloadingUsers} = usersSlice.actions;
export default usersSlice.reducer;
