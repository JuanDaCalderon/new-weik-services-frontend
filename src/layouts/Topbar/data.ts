import {PAGE_LOG_OUT} from '@/constants';
import {ProfileOption} from './types';

// get the profilemenu
const profileMenus: ProfileOption[] = [
  {
    label: 'Mi cuenta',
    icon: 'mdi mdi-account-circle',
    redirectTo: '#'
  },
  {
    label: 'Roles y Permisos',
    icon: 'mdi mdi-account-edit',
    redirectTo: '#'
  },
  {
    label: 'Cerrar sesión',
    icon: 'mdi mdi-logout',
    redirectTo: PAGE_LOG_OUT
  }
];

export {profileMenus};
