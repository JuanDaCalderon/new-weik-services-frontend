import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '@/store';
import {PayLoadUserType, User} from '@/types';
import {LocalStorageUtil, SessionStorageUtil} from '@/utils';
import {USER_NAME} from '@/constants';

const selectUser = (state: RootState) => state.user;

export const isUserLoggedInSelector = createSelector([selectUser], (user: PayLoadUserType) => {
  let isLoggedInPersistence: boolean = false;
  const userInLocalStorage = LocalStorageUtil.getItem<User>(USER_NAME);
  const userInSessionStorage = SessionStorageUtil.getItem<User>(USER_NAME);
  if (userInLocalStorage) isLoggedInPersistence = true;
  else if (userInSessionStorage) isLoggedInPersistence = true;
  return user.isLoggedIn || isLoggedInPersistence;
});
