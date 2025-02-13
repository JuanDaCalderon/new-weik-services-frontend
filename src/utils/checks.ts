import {Cliente, Employee, Rol} from '@/types';

/**
 * Verifica si un cliente ya existe en la lista de clientes
 *
 * @param {Cliente} cliente
 * @param {Cliente[]} clientes
 * @returns {boolean} true si el cliente ya existe, false si no
 */
export const checkIfClientExists = (cliente: Cliente, clientes: Cliente[]): boolean => {
  return clientes.some(
    (c) =>
      c.nombre.trim().toLowerCase() === cliente.nombre.trim().toLowerCase() ||
      c.domain.trim().toLowerCase() === cliente.domain.trim().toLowerCase()
  );
};

/**
 * Verifica si un rol ya existe en la lista de roles
 *
 * @param {Rol} rol
 * @param {Rol[]} roles
 * @returns {boolean} true si el rol ya existe, false si no
 */
export const checkIfRolExists = (rol: Rol, roles: Rol[]): boolean => {
  return roles.some(
    (r) =>
      r.rol.trim().toLowerCase() === rol.rol.trim().toLowerCase() ||
      r.descripcion.trim().toLowerCase() === rol.descripcion.trim().toLowerCase()
  );
};

/**
 * Verifica si un usuario ya existe en la lista de usuarios
 *
 * @param {Employee} usuario
 * @param {Employee[]} usuarios
 * @returns {boolean} true si el usuario ya existe, false si no
 */
export const checkIfUserExists = (user: Employee, users: Employee[]): boolean => {
  return users.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
};
