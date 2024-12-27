import {Employee} from './users';

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
};

export type PayLoadRolesPermisosType = {
  roles: Rol[];
  permisos: Permiso[];
};

export type RolCreationBasics = Partial<
  Omit<
    Rol,
    | 'id'
    | 'usuarioCreacion'
    | 'usuarioUpdated'
    | 'fechaCreacion'
    | 'fechaActualizacion'
    | 'permisos'
  >
>;

/* -------- Utils -------- */

export type TabContentItem = {
  id: string;
  title: string;
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
  RoleUsuarios: string;
  usuarios: Employee[];
  descripcion: string;
};

export interface PermisoByRoles extends Permiso {
  activo: boolean;
}
