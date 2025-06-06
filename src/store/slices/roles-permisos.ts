import {ROLES_PERMISOS_NAME, SESSION_PERMISOS_KEY, SESSION_ROLES_KEY} from '@/constants';
import {PayLoadRolesPermisosType, Permiso, Rol} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadRolesPermisosType = {
  roles: SessionStorageUtil.getItem<Rol[]>(SESSION_ROLES_KEY) ?? ([] as Rol[]),
  permisos: SessionStorageUtil.getItem<Permiso[]>(SESSION_PERMISOS_KEY) ?? ([] as Permiso[])
};

export const rolesPermisosSlice = createSlice({
  name: ROLES_PERMISOS_NAME,
  initialState,
  reducers: {
    setPermisos: (state: PayLoadRolesPermisosType, action: PayloadAction<Permiso[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Permiso[]>(SESSION_PERMISOS_KEY, action.payload);
      state.permisos = action.payload;
    },
    setRoles: (state: PayLoadRolesPermisosType, action: PayloadAction<Rol[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Rol[]>(SESSION_ROLES_KEY, action.payload);
      state.roles = action.payload;
    },
    clearPermisos: (state: PayLoadRolesPermisosType) => {
      SessionStorageUtil.removeItem(SESSION_PERMISOS_KEY);
      state.permisos = [];
    },
    clearRoles: (state: PayLoadRolesPermisosType) => {
      SessionStorageUtil.removeItem(SESSION_ROLES_KEY);
      state.roles = [];
    }
  }
});

export const {setPermisos, setRoles, clearRoles, clearPermisos} = rolesPermisosSlice.actions;
export default rolesPermisosSlice.reducer;
