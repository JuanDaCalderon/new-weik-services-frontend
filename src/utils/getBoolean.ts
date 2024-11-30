/** Devuele un string 'true' en el valor correspondiente como booleano */
const getBoolean = (value: string): boolean => {
  return value.toLowerCase() === 'true';
};

export {getBoolean};
