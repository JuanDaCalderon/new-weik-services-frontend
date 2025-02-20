/**
 * split array into chunks
 * @param array - array to split
 * @param chunkSize - chunk size
 * @returns
 */
const splitArray = <T>(array: Array<T>, chunkSize: number) => {
  const chunks = Array(Math.ceil(array.length / chunkSize))
    .fill(1)
    .map((_, index) => index * chunkSize)
    .map((begin) => array.slice(begin, begin + chunkSize));
  return chunks;
};

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

export {splitArray, filtrarElementosVigentes};
