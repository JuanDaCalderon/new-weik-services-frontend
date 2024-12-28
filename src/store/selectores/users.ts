import {RootState} from '@/store';

export const selectEmployees = (state: RootState) => state.users.users;

export const selectisLoadingEmployees = (state: RootState) => state.users.isLoadingUsers;
