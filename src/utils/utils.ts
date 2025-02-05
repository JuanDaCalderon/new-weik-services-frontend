/**
 * This function removes the trash from the domain
 * @param domainToBeCleaned
 * @returns
 */
export const removeTrashFromDomain = (domainToBeCleaned: string): string => {
  let newDomain: string = domainToBeCleaned;
  if (domainToBeCleaned.includes('@') && domainToBeCleaned.includes('.')) {
    newDomain = domainToBeCleaned.split('@')[1].split('.')[0];
  }
  return newDomain;
};

/**
 * This function validates if a domain is valid
 * @param domainToBeValidated
 * @returns
 */
export const isValidDomain = (domainToBeValidated: string): boolean => {
  const regex = /^[A-Za-zÑñ]+$/;
  return regex.test(domainToBeValidated);
};

/**
 * This function validates if a name is valid
 * @param nameToBeValidated
 * @returns
 */
export const isValidName = (nameToBeValidated: string): boolean => {
  const regex = /^[A-Za-zÑñ]+(?: [A-Za-zÑñ]+)*$/;
  return regex.test(nameToBeValidated);
};

/**
 * This function formats a text
 * @param text
 * @returns
 */
export const formatText = (text: string) => text.toLowerCase().replace(/\s+/g, '');

/**
 * This function formats a domain
 * @param domain
 * @returns
 */
export const formatDomain = (domain: string) => removeTrashFromDomain(formatText(domain));

/**
 * This function returns if an email has a valid format
 * @param email
 * @returns
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * It generates a username based on the first name and the last name of the user
 *
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string} username
 */
export const generateUsername = (firstName: string, lastName: string): string => {
  const normalizeText = (text: string) =>
    text
      .normalize('NFD') // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos, tildes)
      .replace(/[^a-zA-Z0-9]/g, '') // Elimina caracteres especiales
      .toLowerCase();

  const name = normalizeText(firstName);
  const surname = normalizeText(lastName);
  const randomNumber = Math.floor(100 + Math.random() * 900); // Números entre 100-999
  const randomSuffix = ['x', '99', 'us', 'pro', 'cli', 'ai'][Math.floor(Math.random() * 6)]; // Sufijos aleatorios
  const usernameOptions = [
    `${name}${surname}`, // Ej: "juanperez"
    `${name}_${surname}`, // Ej: "juan_perez"
    `${name}.${surname}`, // Ej: "juan.perez"
    `${name}${surname.charAt(0)}`, // Ej: "juanf"
    `${name.charAt(0)}${surname}`, // Ej: "jperez"
    `${surname}${name.charAt(0)}`, // "perezj"
    `${name}${randomNumber}`, // "juan456"
    `${surname}${randomNumber}`, // "perez789"
    `${name}_${randomNumber}`, // "juan_123"
    `${surname}_${randomNumber}`, // "perez_987"
    `${name}${surname}_${randomNumber}`, // "juanperez_321"
    `${name}.${surname}${randomNumber}`, // "juan.perez456"
    `${name}${randomSuffix}`, // "juan99"
    `${surname}${randomSuffix}`, // "perezx"
    `${name}_${surname}${randomSuffix}`, // "juan_perezpro"
    `${name.charAt(0)}${surname}${randomNumber}`, // "jperez678"
    `${name}${surname.charAt(0)}_${randomNumber}` // "juanf_234"
  ];
  return usernameOptions[Math.floor(Math.random() * usernameOptions.length)];
};
