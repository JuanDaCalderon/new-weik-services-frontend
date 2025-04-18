/**
 * Filter elements with a date range
 * @template {{rangoFechas: [string, string]}} T
 * @param {T[]} elementos
 * @returns {T[]}
 */
const filtrarElementosVigentes = <T extends {rangoFechas: [string, string]}>(elementos: T[]): T[] => {
  const today = new Date();
  return elementos.filter(
    (elemento) => new Date(elemento.rangoFechas[0]) < today && today < new Date(elemento.rangoFechas[1])
  );
};

/**
 * Elimina un elemento de un arreglo basado en una coincidencia del `uuid`.
 *
 * @template T - Tipo del objeto que debe contener una propiedad `uuid` de tipo `string`.
 * @param {T[]} items - Arreglo de objetos del cual se desea eliminar un elemento.
 * @param {string} uuidAEliminar - El valor del `uuid` del objeto que se quiere eliminar.
 * @returns {T[]} - Un nuevo arreglo sin el objeto que tiene el `uuid` especificado.
 *
 * @example
 * const items = [
 *   { uuid: '1', nombre: 'Item 1' },
 *   { uuid: '2', nombre: 'Item 2' },
 * ];
 * const resultado = eliminarPorUuid(items, '2');
 * // resultado => [{ uuid: '1', nombre: 'Item 1' }]
 */
const eliminarPorUuid = <T extends {uuid: string}>(items: T[], uuidAEliminar: string): T[] => {
  return items.filter((item) => item.uuid !== uuidAEliminar);
};

export {filtrarElementosVigentes, eliminarPorUuid};
