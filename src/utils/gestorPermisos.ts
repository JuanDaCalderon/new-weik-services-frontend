import {MenuItem, MenuItemType, Permiso, RolesForUser} from '@/types';

/**
 * Filtra los menús según los permisos otorgados al usuario
 *
 * @param {MenuItem[]} menus
 * @param {RolesForUser[]} roles
 * @param {Permiso[]} permisosOtorgados
 * @param {Permiso[]} permisosDenegados
 * @returns {MenuItem[]} Menús filtrados
 */
export const filterByPermissions = (
  menus: MenuItem[],
  roles: RolesForUser[],
  permisosOtorgados: Permiso[],
  permisosDenegados: Permiso[]
): MenuItem[] => {
  const permisosDesdeRoles = roles.flatMap((rol) => rol.permisos || []).map((p) => p.permiso);
  const permisosOtorgadosIds = permisosOtorgados.map((p) => p.permiso);
  const permisosDenegadosIds = permisosDenegados.map((p) => p.permiso);
  const permisosEfectivos = new Set([...permisosDesdeRoles, ...permisosOtorgadosIds]);
  const filteredMenus = menus.filter((menu) => {
    if (!menu.permisoId) return true;
    const tienePermiso = permisosEfectivos.has(menu.permisoId);
    const estaDenegado = permisosDenegadosIds.includes(menu.permisoId);
    return tienePermiso && !estaDenegado;
  });
  return filteredMenus;
};

/**
 * Filtra los menús anidados según los permisos otorgados al usuario.
 *
 * @param {MenuItemType[]} menus - Lista de menús a filtrar.
 * @param {RolesForUser[]} roles - Roles asignados al usuario.
 * @param {Permiso[]} permisosOtorgados - Permisos explícitamente otorgados.
 * @param {Permiso[]} permisosDenegados - Permisos explícitamente denegados.
 * @returns {MenuItemType[]} - Menús filtrados.
 */
export const navBarFilterByPermissions = (
  menus: MenuItemType[],
  roles: RolesForUser[],
  permisosOtorgados: Permiso[],
  permisosDenegados: Permiso[]
): MenuItemType[] => {
  const hasAccess = (permisoId?: string): boolean => {
    if (!permisoId) return true;
    const permitidoPorRol = roles.some((rol) => rol.permisos?.some((permiso) => permiso.permiso === permisoId));
    const permitidoDirectamente = permisosOtorgados.some((permiso) => permiso.permiso === permisoId);
    const denegado = permisosDenegados.some((permiso) => permiso.permiso === permisoId);
    return (permitidoPorRol || permitidoDirectamente) && !denegado;
  };

  const filterMenuRecursive = (items: MenuItemType[]): MenuItemType[] => {
    return items
      .map((menu) => {
        if (!hasAccess(menu.permisoId)) return null;
        const filteredChildren = menu.children ? filterMenuRecursive(menu.children) : undefined;
        return filteredChildren?.length || !menu.children ? {...menu, children: filteredChildren} : null;
      })
      .filter((item) => item !== null) as MenuItemType[];
  };

  return filterMenuRecursive(menus);
};

/**
 * Verifica si un usuario tiene un permiso específico
 *
 * @param {string} permisoId
 * @param {RolesForUser[]} roles
 * @param {Permiso[]} permisosOtorgados
 * @param {Permiso[]} permisosDenegados
 * @returns {boolean} true si tiene permiso, false si no
 */
export const hasPermission = (
  permisoId: string,
  roles: RolesForUser[],
  permisosOtorgados: Permiso[],
  permisosDenegados: Permiso[]
): boolean => {
  // Verificar si algún rol del usuario tiene el permiso
  const hasRolePermission = roles.some((rol) => rol.permisos?.some((permiso) => permiso.permiso === permisoId));
  // Verificar si el permiso está otorgado directamente
  const isGranted = permisosOtorgados.some((permiso) => permiso.permiso === permisoId);
  // Verificar si el permiso está denegado
  const isDenied = permisosDenegados.some((permiso) => permiso.permiso === permisoId);
  // Priorizar denegaciones
  if (isDenied) return false;
  // Retornar true si tiene permiso por rol o está otorgado directamente
  return hasRolePermission || isGranted;
};
