import {CLIENTES_NAME, ROLES_PERMISOS_NAME, USER_NAME} from '@/constants';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import userReducer from './slices/user';
import rolesPermisosSlice from './slices/roles-permisos';
import clientesSlice from './slices/clientes';

const rootReducer = combineReducers({
  [USER_NAME]: userReducer,
  [ROLES_PERMISOS_NAME]: rolesPermisosSlice,
  [CLIENTES_NAME]: clientesSlice
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
