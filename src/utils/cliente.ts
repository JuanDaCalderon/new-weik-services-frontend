import {Cliente} from '@/types';

export const checkIfClientExists = (cliente: Cliente, clientes: Cliente[]) => {
  return clientes.some(
    (c) =>
      c.nombre.toLowerCase() === cliente.nombre.toLowerCase() ||
      c.domain.toLowerCase() === cliente.domain.toLowerCase()
  );
};
