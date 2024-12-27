import {ROLES_CELLS, USUARIOS_CELLS} from '@/constants';

export interface RolesUsuariosContext {
  rolesCell: ROLES_CELLS;
  usuariosCell: USUARIOS_CELLS;
}

export interface RolesUsuariosContextType {
  rolesUsuarios: RolesUsuariosContext;
  updateRolesCell: (rolesCell: ROLES_CELLS) => void;
  updateUsuariosCell: (usuariosCell: USUARIOS_CELLS) => void;
}
