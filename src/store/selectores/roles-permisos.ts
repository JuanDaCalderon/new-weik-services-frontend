import {RootState} from '@/store';
import {PayLoadRolesPermisosType} from '@/types';
import {createSelector} from '@reduxjs/toolkit';

const selectRolesYPermisos = (state: RootState) => state['roles-permisos'];

export const permisosSelector = createSelector([selectRolesYPermisos], (rolYPermiso: PayLoadRolesPermisosType) => {
  return rolYPermiso.permisos;
});

export const rolesSelector = createSelector([selectRolesYPermisos], (rolYPermiso: PayLoadRolesPermisosType) => {
  return rolYPermiso.roles;
});
