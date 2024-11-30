import {USER_DOMAIN, USER_NAME} from '@/constants';
import {PayLoadUserType, User} from '@/types';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {LocalStorageUtil} from '@/utils/localStorage';

const initialState: PayLoadUserType = {
  user: LocalStorageUtil.getItem<User>(USER_NAME) ?? ({} as User),
  domain: LocalStorageUtil.getItem<string>(USER_DOMAIN) ?? '',
  isLoggedIn: LocalStorageUtil.getItem<string>(USER_NAME) ? true : false
};

export const userSlice = createSlice({
  name: USER_NAME,
  initialState,
  reducers: {
    setUser: (state: PayLoadUserType, action: PayloadAction<PayLoadUserType>) => {
      LocalStorageUtil.setItem<User>(USER_NAME, action.payload.user);
      LocalStorageUtil.setItem<string>(USER_DOMAIN, action.payload.domain);
      return {
        ...state,
        user: {...action.payload.user},
        domain: action.payload.domain,
        isLoggedIn: action.payload.isLoggedIn
      } as PayLoadUserType;
    },
    logOutUser: (state: PayLoadUserType) => {
      LocalStorageUtil.removeItem(USER_NAME);
      LocalStorageUtil.removeItem(USER_DOMAIN);
      return {
        ...state,
        user: {} as User,
        domain: '',
        isLoggedIn: false
      } as PayLoadUserType;
    }
  }
});

export const {setUser, logOutUser} = userSlice.actions;
export default userSlice.reducer;
