import {isPlainObject, Middleware, UnknownAction} from '@reduxjs/toolkit';
import {clearUsers, setIsloadingUsers} from '@/store/slices/users';
import {RootState} from '@/store';

export const dedupeUsersMiddleware: Middleware = (store) => (next) => (action) => {
  if (!isPlainObject(action)) {
    return next(action);
  }
  const state = store.getState() as RootState;

  if ((action as UnknownAction).type === clearUsers.type) {
    if (state.users.users.length === 0) return;
  }

  if ((action as UnknownAction).type === setIsloadingUsers.type) {
    const payload = (action as UnknownAction).payload as boolean;
    if (state.users.isLoading === payload) return;
  }

  return next(action);
};
