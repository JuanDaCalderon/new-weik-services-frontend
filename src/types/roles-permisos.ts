export type Permiso = {
  id: string;
  permiso: string;
};

export type Rol = {
  id: string;
  rol: string;
  permisos: Permiso[];
};

export type PayLoadRolesPermisosType = {
  roles: Rol[];
  permisos: Permiso[];
};
