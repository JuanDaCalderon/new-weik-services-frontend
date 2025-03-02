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

export {filtrarElementosVigentes};
