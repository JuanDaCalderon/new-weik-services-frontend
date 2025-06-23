import {PERMISOS_NAME, ROLES_PERMISOS_NAME, ROLES_NAME} from '@/constants';
import {PayLoadRolesPermisosType, Permiso, Rol} from '@/types';
import {SessionStorageUtil} from '@/utils';
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

const initialState: PayLoadRolesPermisosType = {
  roles: SessionStorageUtil.getItem<Rol[]>(ROLES_NAME) ?? ([] as Rol[]),
  permisos: SessionStorageUtil.getItem<Permiso[]>(PERMISOS_NAME) ?? ([] as Permiso[])
};

export const rolesPermisosSlice = createSlice({
  name: ROLES_PERMISOS_NAME,
  initialState,
  reducers: {
    setPermisos: (state: PayLoadRolesPermisosType, action: PayloadAction<Permiso[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Permiso[]>(PERMISOS_NAME, action.payload);
      state.permisos = action.payload;
    },
    setRoles: (state: PayLoadRolesPermisosType, action: PayloadAction<Rol[]>) => {
      if (action.payload.length > 0) SessionStorageUtil.setItem<Rol[]>(ROLES_NAME, action.payload);
      state.roles = action.payload;
    },
    clearPermisos: (state: PayLoadRolesPermisosType) => {
      SessionStorageUtil.removeItem(PERMISOS_NAME);
      state.permisos = [];
    },
    clearRoles: (state: PayLoadRolesPermisosType) => {
      SessionStorageUtil.removeItem(ROLES_NAME);
      state.roles = [];
    }
  }
});

export const {setPermisos, setRoles, clearRoles, clearPermisos} = rolesPermisosSlice.actions;
export default rolesPermisosSlice.reducer;
