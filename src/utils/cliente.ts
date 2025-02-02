import {Cliente} from '@/types';

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
      c.nombre.toLowerCase() === cliente.nombre.toLowerCase() ||
      c.domain.toLowerCase() === cliente.domain.toLowerCase()
  );
};
