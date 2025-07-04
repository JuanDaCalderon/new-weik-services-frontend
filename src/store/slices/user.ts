import {
  APPS_NAME,
  CLIENTES_NAME,
  EVENTOS_NAME,
  HORARIOS_NAME,
  NOTICIAS_NAME,
  OBJETIVOS_NAME,
  PERMISOS_NAME,
  ROLES_NAME,
  USER_DOMAIN,
  USER_NAME,
  VACACIONES_NAME
} from '@/constants';
import {HorasTrabajoType, PartialEmployee, PayLoadUserType, User} from '@/types';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {LocalStorageUtil, SessionStorageUtil} from '@/utils';

const userInLocalStorage: User | null = LocalStorageUtil.getItem<User>(USER_NAME) ?? null;
const userInSessionStorage: User | null = SessionStorageUtil.getItem<User>(USER_NAME) ?? null;

const domainInLocalStorage: string | null = LocalStorageUtil.getItem<string>(USER_DOMAIN) ?? null;
const domainInSessionStorage: string | null = SessionStorageUtil.getItem<string>(USER_DOMAIN) ?? null;

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
      const {rememberme, user, domain, isLoggedIn} = action.payload;
      if (rememberme) {
        LocalStorageUtil.setItem<User>(USER_NAME, user);
        LocalStorageUtil.setItem<string>(USER_DOMAIN, domain);
      } else {
        SessionStorageUtil.setItem<User>(USER_NAME, user);
        SessionStorageUtil.setItem<string>(USER_DOMAIN, domain);
      }
      state.user = user;
      state.domain = domain;
      state.isLoggedIn = isLoggedIn;
      state.rememberme = !!rememberme;
    },
    updateUserImage: (state: PayLoadUserType, action: PayloadAction<string>) => {
      state.user.userImage = action.payload;
      if (state.rememberme) LocalStorageUtil.updateItem<User>(USER_NAME, state.user);
      else SessionStorageUtil.updateItem<User>(USER_NAME, state.user);
    },
    updateDataUser: (state: PayLoadUserType, action: PayloadAction<PartialEmployee>) => {
      const partialUser = action.payload;
      const user: User = {
        ...state.user,
        ...partialUser
      };
      if (state.rememberme) LocalStorageUtil.updateItem<User>(USER_NAME, user);
      else SessionStorageUtil.updateItem<User>(USER_NAME, user);
      state.user = user;
    },
    updateWorkingHoursUser: (state: PayLoadUserType, action: PayloadAction<HorasTrabajoType[]>) => {
      state.user.horasTrabajo = action.payload;
      if (state.rememberme) LocalStorageUtil.updateItem<User>(USER_NAME, state.user);
      else SessionStorageUtil.updateItem<User>(USER_NAME, state.user);
    },
    logOutUser: (state: PayLoadUserType) => {
      LocalStorageUtil.removeItem(USER_NAME);
      LocalStorageUtil.removeItem(USER_DOMAIN);
      LocalStorageUtil.removeItem(HORARIOS_NAME);
      LocalStorageUtil.removeItem(VACACIONES_NAME);
      SessionStorageUtil.removeItem(APPS_NAME);
      SessionStorageUtil.removeItem(CLIENTES_NAME);
      SessionStorageUtil.removeItem(EVENTOS_NAME);
      SessionStorageUtil.removeItem(NOTICIAS_NAME);
      SessionStorageUtil.removeItem(OBJETIVOS_NAME);
      SessionStorageUtil.removeItem(PERMISOS_NAME);
      SessionStorageUtil.removeItem(ROLES_NAME);
      SessionStorageUtil.removeItem(USER_NAME);
      SessionStorageUtil.removeItem(USER_DOMAIN);
      SessionStorageUtil.clear();
      state.user = {} as User;
      state.domain = '';
      state.isLoggedIn = false;
      state.rememberme = false;
    }
  }
});

export const {setUser, logOutUser, updateUserImage, updateDataUser, updateWorkingHoursUser} = userSlice.actions;
export default userSlice.reducer;
