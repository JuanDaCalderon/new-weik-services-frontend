import {ProfileOption} from '@/types';
import {PAGE_LOG_OUT, PAGE_PROFILE, PAGE_ROLES_PERMISOS, PERMISOS_MAP_IDS} from '@/constants';

export const profileMenus: ProfileOption[] = [
  {
    label: 'Mi cuenta',
    icon: 'mdi mdi-account-circle',
    redirectTo: PAGE_PROFILE
  },
  {
    label: 'Roles y Permisos',
    icon: 'mdi mdi-account-edit',
    redirectTo: PAGE_ROLES_PERMISOS,
    permisoId: PERMISOS_MAP_IDS.accesoRolesPermisos
  },
  {
    label: 'Cerrar sesión',
    icon: 'mdi mdi-logout',
    redirectTo: PAGE_LOG_OUT
  }
];
