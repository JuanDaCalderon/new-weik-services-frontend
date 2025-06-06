/**
 * Función que devuelve el estado de una solicitud
 * @param aprobadas boolean | null - Estado de la solicitud
 * @returns {status: string, statusCopy: string} - Objeto con el estado y su label
 */
export const getStatus = (aprobadas: boolean | null, isMyVacations: boolean): {status: string; statusCopy: string} => {
  if (aprobadas === true) return {status: 'bg-success', statusCopy: 'Aprobadas'};
  if (aprobadas === false) return {status: 'bg-danger', statusCopy: 'Denegadas'};
  if (isMyVacations) return {status: 'bg-info', statusCopy: 'Pendiente'};
  return {status: 'bg-secondary', statusCopy: 'Pendiente'};
};
