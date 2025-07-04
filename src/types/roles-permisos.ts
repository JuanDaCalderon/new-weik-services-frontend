import {Employee} from '@/types';

export type Permiso = {
  id: string;
  permiso: string;
  labelName: string;
};

export type Rol = {
  id: string;
  rol: string;
  descripcion: string;
  permisos: Permiso[];
  usuarioCreacion: Pick<Employee, 'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'>;
  usuarioUpdated: Pick<Employee, 'email' | 'nombres' | 'apellidos' | 'userName' | 'userImage'>;
  fechaCreacion: string;
  fechaActualizacion: string;
  isMainRol?: boolean;
};

export type PayLoadRolesPermisosType = {
  roles: Rol[];
  permisos: Permiso[];
};

export type RolCreationBasics = Partial<
  Omit<Rol, 'id' | 'usuarioCreacion' | 'usuarioUpdated' | 'fechaCreacion' | 'fechaActualizacion' | 'permisos'>
>;

/* -------- Utils -------- */

export type TabContentItem = {
  id: string;
  title: string;
  icon?: string;
  text?: string;
};

export type thisRol = {
  id: number;
  rolName: string;
  createdBy: string;
  updatedBy: string;
  ribbonCreatedDate: Date;
  ribbonUpdatedDate: Date;
  createdDate: string;
  updatedDate: string;
  RolePermisos: string;
  RoleUsuarios: string | null;
  usuarios: Employee[];
  descripcion: string;
  isMainRol?: boolean;
};

export interface PermisoByRoles extends Permiso {
  activo: boolean;
}
