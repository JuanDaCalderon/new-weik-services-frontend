import {MenuItem, Permiso, RolesForUser} from '@/types';

export const filterByPermissions = (
  menus: MenuItem[],
  roles: RolesForUser[],
  permisosOtorgados: Permiso[],
  permisosDenegados: Permiso[]
): MenuItem[] => {
  let filteredMenus: MenuItem[];

  // Filtrar según los roles del usuario
  filteredMenus = menus.filter((menu) => {
    if (!menu.permisoId) return true;
    return roles.some((rol) => rol.permisos?.some((permiso) => permiso.permiso === menu.permisoId));
  });

  // Incluir permisos otorgados directamente
  if (permisosOtorgados.length > 0) {
    if (filteredMenus.length !== menus.length) filteredMenus = menus;
    filteredMenus = filteredMenus.filter((menu) => {
      if (!menu.permisoId) return true;
      return permisosOtorgados.some((permiso) => permiso.permiso === menu.permisoId);
    });
  }

  // Excluir permisos denegados
  if (permisosDenegados.length > 0) {
    filteredMenus = filteredMenus.filter((menu) => {
      if (!menu.permisoId) return true;
      return !permisosDenegados.some((permiso) => permiso.permiso === menu.permisoId);
    });
  }

  return filteredMenus;
};

export const hasPermission = (
  permisoId: string,
  roles: RolesForUser[],
  permisosOtorgados: Permiso[],
  permisosDenegados: Permiso[]
): boolean => {
  // Verificar si algún rol del usuario tiene el permiso
  const hasRolePermission = roles.some((rol) =>
    rol.permisos?.some((permiso) => permiso.permiso === permisoId)
  );

  // Verificar si el permiso está otorgado directamente
  const isGranted = permisosOtorgados.some((permiso) => permiso.permiso === permisoId);

  // Verificar si el permiso está denegado
  const isDenied = permisosDenegados.some((permiso) => permiso.permiso === permisoId);

  // Priorizar denegaciones
  if (isDenied) return false;

  // Retornar true si tiene permiso por rol o está otorgado directamente
  return hasRolePermission || isGranted;
};
