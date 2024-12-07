import {Employee} from './users';

export type Permiso = {
  id: string;
  permiso: string;
};

export type Rol = {
  id: string;
  rol: string;
  descripcion: string;
  permisos: Permiso[];
  usuarioCreacion: Pick<Employee, 'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'>;
  fechaCreacion: string;
  fechaActualizacion: string;
};

export type PayLoadRolesPermisosType = {
  roles: Rol[];
  permisos: Permiso[];
};

/* -------- Utils -------- */

export type TabContentItem = {
  id: string;
  title: string;
};
