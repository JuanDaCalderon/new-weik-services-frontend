import {
  APPS_NAME,
  CLIENTES_NAME,
  EVENTOS_NAME,
  NOTICIAS_NAME,
  ROLES_PERMISOS_NAME,
  USER_NAME,
  USERS_NAME
} from '@/constants';
import {dedupeUsersMiddleware} from '@/store/middlewares/dedupeUsersMiddleware';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import userReducer from '@/store/slices/user';
import rolesPermisosSlice from '@/store/slices/roles-permisos';
import clientesSlice from '@/store/slices/clientes';
import usersSlice from '@/store/slices/users';
import noticiasSlice from '@/store/slices/noticias';
import appsSlice from '@/store/slices/apps';
import eventosSlice from '@/store/slices/eventos';

const rootReducer = combineReducers({
  [USER_NAME]: userReducer,
  [USERS_NAME]: usersSlice,
  [ROLES_PERMISOS_NAME]: rolesPermisosSlice,
  [CLIENTES_NAME]: clientesSlice,
  [NOTICIAS_NAME]: noticiasSlice,
  [APPS_NAME]: appsSlice,
  [EVENTOS_NAME]: eventosSlice
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dedupeUsersMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
