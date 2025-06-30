import {
  APPS_NAME,
  CLIENTES_NAME,
  EVENTOS_NAME,
  HORARIOS_NAME,
  NOTICIAS_NAME,
  OBJETIVOS_NAME,
  REGISTROS_NAME,
  ROLES_PERMISOS_NAME,
  SELECTED_ROW_NAME,
  USER_NAME,
  USUARIOS_NAME,
  UTILITIES_NAME,
  VACACIONES_NAME
} from '@/constants';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import userReducer from '@/store/slices/user';
import rolesPermisosSlice from '@/store/slices/roles-permisos';
import clientesSlice from '@/store/slices/clientes';
import usersSlice from '@/store/slices/users';
import noticiasSlice from '@/store/slices/noticias';
import appsSlice from '@/store/slices/apps';
import eventosSlice from '@/store/slices/eventos';
import horariosSlice from '@/store/slices/horarios';
import vacacionesSlice from '@/store/slices/vacaciones';
import objetivosSlice from '@/store/slices/objetivos';
import registrosSlice from '@/store/slices/registros';
import utilitiesSlice from '@/store/slices/utilities';
import SelectedRowType from '@/store/slices/selected-row';
import {dedupeRegistrosMiddleware, dedupeUsersMiddleware, dedupeSelectedRowMiddleware} from './middlewares';

const rootReducer = combineReducers({
  [USER_NAME]: userReducer,
  [USUARIOS_NAME]: usersSlice,
  [ROLES_PERMISOS_NAME]: rolesPermisosSlice,
  [CLIENTES_NAME]: clientesSlice,
  [NOTICIAS_NAME]: noticiasSlice,
  [APPS_NAME]: appsSlice,
  [EVENTOS_NAME]: eventosSlice,
  [HORARIOS_NAME]: horariosSlice,
  [VACACIONES_NAME]: vacacionesSlice,
  [OBJETIVOS_NAME]: objetivosSlice,
  [REGISTROS_NAME]: registrosSlice,
  [SELECTED_ROW_NAME]: SelectedRowType,
  [UTILITIES_NAME]: utilitiesSlice
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dedupeUsersMiddleware)
      .concat(dedupeRegistrosMiddleware)
      .concat(dedupeSelectedRowMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
