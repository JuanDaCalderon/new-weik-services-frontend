import {CLIENTES_NAME, ROLES_PERMISOS_NAME, USER_NAME, USERS_NAME} from '@/constants';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import userReducer from './slices/user';
import rolesPermisosSlice from './slices/roles-permisos';
import clientesSlice from './slices/clientes';
import usersSlice from './slices/users';

const rootReducer = combineReducers({
  [USER_NAME]: userReducer,
  [USERS_NAME]: usersSlice,
  [ROLES_PERMISOS_NAME]: rolesPermisosSlice,
  [CLIENTES_NAME]: clientesSlice
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
