import {
  SESSION_CLIENTES_KEY,
  SESSION_PERMISOS_KEY,
  SESSION_ROLES_KEY,
  USER_DOMAIN,
  USER_NAME
} from '@/constants';
import {PayLoadUserType, User} from '@/types';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {LocalStorageUtil, SessionStorageUtil} from '@/utils';

const userInLocalStorage: User | null = LocalStorageUtil.getItem<User>(USER_NAME) ?? null;
const userInSessionStorage: User | null = SessionStorageUtil.getItem<User>(USER_NAME) ?? null;

const domainInLocalStorage: string | null = LocalStorageUtil.getItem<string>(USER_DOMAIN) ?? null;
const domainInSessionStorage: string | null =
  SessionStorageUtil.getItem<string>(USER_DOMAIN) ?? null;

let isLoggedInPersistence: boolean = false;
if (userInLocalStorage) isLoggedInPersistence = true;
else if (userInSessionStorage) isLoggedInPersistence = true;

const initialState: PayLoadUserType = {
  user: userInLocalStorage ?? userInSessionStorage ?? ({} as User),
  domain: domainInLocalStorage ?? domainInSessionStorage ?? '',
  isLoggedIn: isLoggedInPersistence,
  rememberme: userInLocalStorage ? true : false
};

export const userSlice = createSlice({
  name: USER_NAME,
  initialState,
  reducers: {
    setUser: (state: PayLoadUserType, action: PayloadAction<PayLoadUserType>) => {
      const {rememberme} = action.payload;
      if (rememberme) {
        LocalStorageUtil.setItem<User>(USER_NAME, action.payload.user);
        LocalStorageUtil.setItem<string>(USER_DOMAIN, action.payload.domain);
      } else {
        SessionStorageUtil.setItem<User>(USER_NAME, action.payload.user);
        SessionStorageUtil.setItem<string>(USER_DOMAIN, action.payload.domain);
      }
      return {
        ...state,
        user: {...action.payload.user},
        domain: action.payload.domain,
        isLoggedIn: action.payload.isLoggedIn,
        rememberme: !!rememberme
      } as PayLoadUserType;
    },
    logOutUser: (state: PayLoadUserType) => {
      LocalStorageUtil.removeItem(USER_NAME);
      LocalStorageUtil.removeItem(USER_DOMAIN);
      SessionStorageUtil.removeItem(USER_NAME);
      SessionStorageUtil.removeItem(USER_DOMAIN);
      SessionStorageUtil.removeItem(SESSION_CLIENTES_KEY);
      SessionStorageUtil.removeItem(SESSION_PERMISOS_KEY);
      SessionStorageUtil.removeItem(SESSION_ROLES_KEY);
      return {
        ...state,
        user: {} as User,
        domain: '',
        isLoggedIn: false,
        rememberme: false
      } as PayLoadUserType;
    }
  }
});

export const {setUser, logOutUser} = userSlice.actions;
export default userSlice.reducer;
