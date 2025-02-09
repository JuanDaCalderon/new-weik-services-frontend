import {
  CLIENTES_NAME,
  ROLES_PERMISOS_NAME,
  USER_NAME,
  USERS_NAME,
  CLOCK_IN_CLOCK_OUT_NAME
} from '@/constants';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import userReducer from '@/store/slices/user';
import rolesPermisosSlice from '@/store/slices/roles-permisos';
import clientesSlice from '@/store/slices/clientes';
import usersSlice from '@/store/slices/users';
import clockSlice from '@/store/slices/clock';

const rootReducer = combineReducers({
  [USER_NAME]: userReducer,
  [USERS_NAME]: usersSlice,
  [ROLES_PERMISOS_NAME]: rolesPermisosSlice,
  [CLIENTES_NAME]: clientesSlice,
  [CLOCK_IN_CLOCK_OUT_NAME]: clockSlice
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
