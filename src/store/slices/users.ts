import {USERS_NAME} from '@/constants';
import {Employee} from '@/types';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: Employee[] = [];

export const usersSlice = createSlice({
  name: USERS_NAME,
  initialState,
  reducers: {
    setUsers: (_state: Employee[], action: PayloadAction<Employee[]>) => {
      return [...action.payload];
    },
    clearUsers: () => {
      return [];
    }
  }
});

export const {setUsers, clearUsers} = usersSlice.actions;
export default usersSlice.reducer;
