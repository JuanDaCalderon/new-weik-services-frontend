import {Employee, thisUsuarios, User} from '@/types';
import {DebugUtil} from './debug';

/**
 * Obtiene el nombre completo del usuario. Si no tiene nombres o apellidos, retorna el nombre de usuario;
 * si tampoco tiene, retorna el correo electrónico.
 *
 * @param {User | Employee} user - El objeto del usuario que contiene la información personal.
 * @returns {string} El nombre completo, nombre de usuario o correo electrónico del usuario.
 */
const getNombreCompletoUser = (user: User | Employee | thisUsuarios): string => {
  try {
    const {apellidos, email, nombres, userName} = user;
    if (nombres !== '' || apellidos !== '') return `${nombres} ${apellidos}`;
    else if (userName !== '') return userName;
    else return email;
  } catch (error: any) {
    DebugUtil.logError('Error al obtener el nombre completo del usuario', error);
    return 'Sin Nombre';
  }
};

/**
 * Obtiene el nombre de usuario. Si no tiene, retorna el nombre completo; si tampoco tiene,
 * retorna el correo electrónico.
 *
 * @param {User | Employee} user - El objeto del usuario que contiene la información personal.
 * @returns {string} El nombre de usuario, nombre completo o correo electrónico del usuario.
 */
const getUserNameUser = (user: User | Employee | thisUsuarios): string => {
  try {
    const {apellidos, email, nombres, userName} = user;
    if (userName !== '') return userName;
    else if (nombres !== '' || apellidos !== '') return `${nombres} ${apellidos}`;
    else return email;
  } catch (error: any) {
    DebugUtil.logError('Error al obtener el nombre de usuario', error);
    return 'Sin Nombre';
  }
};

/**
 * Obtiene los roles del usuario como una cadena separada por guiones.
 * Si no tiene roles, retorna el cargo. Si tampoco tiene cargo, retorna "Sin Rol".
 *
 * @param {User | Employee} user - El objeto del usuario que contiene la información laboral.
 * @returns {string} Los roles o cargo del usuario, o "Sin Rol" si no se encuentra información.
 */
const getRolesUser = (user: User | Employee | thisUsuarios): string => {
  try {
    const {roles, cargo} = user;
    if (roles && roles.length > 0) return roles.map((rol) => rol.rol).join(' - ');
    else if (cargo !== '') return cargo;
    else return 'Sin Rol';
  } catch (error: any) {
    DebugUtil.logError('Error al obtener los roles del usuario', error);
    return 'Sin Rol';
  }
};

/**
 * Obtiene el cargo del usuario. Si no tiene cargo, retorna los roles como una cadena
 * separada por guiones. Si tampoco tiene roles, retorna "Sin Cargo".
 *
 * @param {User | Employee} user - El objeto del usuario que contiene la información laboral.
 * @returns {string} El cargo o roles del usuario, o "Sin Cargo" si no se encuentra información.
 */
const getCargoUser = (user: User | Employee | thisUsuarios): string => {
  try {
    const {cargo, roles} = user;
    if (cargo !== '') return cargo;
    else if (roles && roles.length > 0) return roles.map((rol) => rol.rol).join(' - ');
    else return 'Sin Cargo';
  } catch (error: any) {
    DebugUtil.logError('Error al obtener el cargo del usuario', error);
    return 'Sin Cargo';
  }
};

/**
 * truncate the string to a max number of characters and appends ‘…’
 */
const truncateString = (str: string, maxLength: number): string => {
  if (str.length > maxLength) return str.substring(0, maxLength - 3) + '...';
  return str;
};

export {getNombreCompletoUser, getUserNameUser, getRolesUser, getCargoUser, truncateString};
