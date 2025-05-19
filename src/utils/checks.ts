import {Apps, Cliente, Employee, Noticia, Objetivos, Rol} from '@/types';

/**
 * Verifica si un acceso directo ya existe en la lista de accesos
 *
 * @param {Apps} app
 * @param {Apps[]} apps
 * @returns {boolean} true si el app ya existe, false si no
 */
export const checkIfAppExists = (app: Apps, apps: Apps[]): boolean => {
  return apps.some(
    (a) =>
      a.name.trim().toLowerCase() === app.name.trim().toLowerCase() ||
      a.redirectTo.trim().toLowerCase() === app.redirectTo.trim().toLowerCase()
  );
};

/**
 * Verifica si una noticia ya existe en la lista de noticias
 *
 * @param {Noticia} noticia
 * @param {Noticia[]} noticias
 * @returns {boolean} true si la noticia ya existe, false si no
 */
export const checkIfNoticiaExists = (noticia: Noticia, noticias: Noticia[]): boolean => {
  return noticias.some(
    (n) =>
      n.titulo.trim().toLowerCase() === noticia.titulo.trim().toLowerCase() ||
      n.link.trim().toLowerCase() === noticia.link.trim().toLowerCase()
  );
};

/**
 * Verifica si un objetivo ya existe en la lista de objetivos
 *
 * @param {Objetivos} objetivo
 * @param {Objetivos[]} objetivos
 * @returns {boolean} true si el objetivo ya existe, false si no
 */
export const checkIfObjetivoExists = (objetivo: Objetivos, objetivos: Objetivos[]): boolean => {
  return objetivos.some(
    (o) =>
      o.titulo.trim().toLowerCase() === objetivo.titulo.trim().toLowerCase() ||
      o.descripcion.trim().toLowerCase() === objetivo.descripcion.trim().toLowerCase()
  );
};

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
      r.rol.trim().toLowerCase() === rol.rol?.trim().toLowerCase() ||
      r.descripcion.trim().toLowerCase() === rol.descripcion?.trim().toLowerCase()
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
