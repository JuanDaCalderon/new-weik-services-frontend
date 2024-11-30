import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '@/store';
import {PayLoadUserType} from '@/types';
import {LocalStorageUtil} from '@/utils/localStorage';
import {USER_NAME} from '@/constants';

const selectUser = (state: RootState) => state.user;

export const isUserLoggedInSelector = createSelector([selectUser], (user: PayLoadUserType) => {
  const isLoggedInLocalStorage: boolean = LocalStorageUtil.getItem<string>(USER_NAME)
    ? true
    : false;
  return user.isLoggedIn || isLoggedInLocalStorage;
});
